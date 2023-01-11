export function tableToMarkdown(headers: string[], rows: string[][]): string {
    let markdown = ''

    // Find the maximum width of each column
    const columnWidths: number[] = []
    for (let i = 0; i < headers.length; i++) {
        let maxWidth = headers[i].length
        rows.forEach((row) => {
            maxWidth = Math.max(maxWidth, row[i].length)
        })
        columnWidths.push(maxWidth)
    }

    // Add the headers
    markdown += `${headers.map((header, i) => header.padEnd(columnWidths[i])).join(' | ')}\n`
    markdown += `${headers.map((_header, i) => '-'.repeat(columnWidths[i])).join(' | ')}\n`

    // Add the rows
    rows.forEach((row) => {
        markdown += `${row.map((cell, i) => cell.padEnd(columnWidths[i])).join(' | ')}\n`
    })

    return markdown
}
