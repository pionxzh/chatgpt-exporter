const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
const PNG_TYPE_IHDR = new Uint8Array([73, 72, 68, 82])
const PNG_TYPE_IDAT = new Uint8Array([73, 68, 65, 84])
const PNG_TYPE_IEND = new Uint8Array([73, 69, 78, 68])
const ROW_CHUNK_BYTES = 256 * 1024

const crcTable = new Uint32Array(256)
for (let index = 0; index < crcTable.length; index++) {
    let value = index
    for (let bit = 0; bit < 8; bit++) {
        value = value & 1 ? 0xEDB88320 ^ (value >>> 1) : value >>> 1
    }
    crcTable[index] = value >>> 0
}

function writeUint32(target: Uint8Array, offset: number, value: number) {
    target[offset] = value >>> 24
    target[offset + 1] = value >>> 16
    target[offset + 2] = value >>> 8
    target[offset + 3] = value
}

function pngChunk(type: Uint8Array, data = new Uint8Array()): Uint8Array {
    const chunk = new Uint8Array(12 + data.length)
    writeUint32(chunk, 0, data.length)
    chunk.set(type, 4)
    chunk.set(data, 8)

    let crc = 0xFFFFFFFF
    for (let index = 4; index < 8 + data.length; index++) {
        crc = crcTable[(crc ^ chunk[index]) & 0xFF] ^ (crc >>> 8)
    }
    writeUint32(chunk, 8 + data.length, (crc ^ 0xFFFFFFFF) >>> 0)
    return chunk
}

function pngHeader(width: number, height: number): Uint8Array {
    const data = new Uint8Array(13)
    writeUint32(data, 0, width)
    writeUint32(data, 4, height)
    data[8] = 8 // bit depth
    data[9] = 6 // RGBA
    return pngChunk(PNG_TYPE_IHDR, data)
}

export interface RgbaRows {
    data: Uint8ClampedArray
    width: number
    height: number
}

export async function encodePng(
    width: number,
    renderRows: (appendRows: (rows: RgbaRows) => Promise<void>) => Promise<void>,
): Promise<Blob> {
    if (!Number.isInteger(width) || width <= 0) {
        throw new RangeError('PNG width must be a positive integer')
    }
    if (typeof CompressionStream === 'undefined') {
        throw new TypeError('CompressionStream is not supported by this browser')
    }

    const compression = new CompressionStream('deflate')
    const writer = compression.writable.getWriter()
    const idatChunks: Uint8Array[] = []
    const readCompressedData = (async () => {
        const reader = compression.readable.getReader()
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            idatChunks.push(pngChunk(PNG_TYPE_IDAT, value))
        }
    })()

    let writtenRows = 0
    try {
        await renderRows(async ({ data, width: rowWidth, height: rowCount }) => {
            if (rowWidth !== width || data.length !== rowWidth * rowCount * 4) {
                throw new RangeError('Invalid RGBA rows supplied to PNG encoder')
            }

            const rgbaStride = width * 4
            const pngStride = rgbaStride + 1
            const rowsPerWrite = Math.max(1, Math.floor(ROW_CHUNK_BYTES / pngStride))
            for (let startRow = 0; startRow < rowCount; startRow += rowsPerWrite) {
                const rowsInWrite = Math.min(rowsPerWrite, rowCount - startRow)
                const filteredRows = new Uint8Array(pngStride * rowsInWrite)
                for (let row = 0; row < rowsInWrite; row++) {
                    const sourceOffset = (startRow + row) * rgbaStride
                    const targetOffset = row * pngStride
                    // Filter type 0 is intentionally simple and leaves compression
                    // to the browser's native deflate implementation.
                    filteredRows[targetOffset] = 0
                    filteredRows.set(data.subarray(sourceOffset, sourceOffset + rgbaStride), targetOffset + 1)
                }
                await writer.write(filteredRows)
            }
            writtenRows += rowCount
        })
        if (writtenRows === 0) throw new RangeError('PNG must contain at least one row')
        await writer.close()
        await readCompressedData
    }
    catch (error) {
        await writer.abort(error).catch(() => {})
        await readCompressedData.catch(() => {})
        throw error
    }

    return new Blob([
        PNG_SIGNATURE,
        pngHeader(width, writtenRows),
        ...idatChunks,
        pngChunk(PNG_TYPE_IEND),
    ], { type: 'image/png' })
}
