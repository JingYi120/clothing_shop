const { stringify } = require("csv-stringify")
const { Readable } = require("stream")
const XLSX = require("xlsx")
const { promisify } = require("util")
const pipelineAsync = promisify(require("stream").pipeline)

const exportServices = {
  exportToCsv: async (res, data) => {
    res.setHeader("Content-Disposition", "attachment; filename=sales_report.csv")
    res.setHeader("Content-Type", "text/csv")

    const stringifier = stringify({
      header: true,
      columns: {
        "#": "#",
        Name: "Name",
        Price: "Price(NT.)",
        Category: "Category",
        Quantity: "Quantity",
        "Total Sales": "Total Sales(NT.)",
      },
    })

    const input = Readable.from(data)

    try {
      await pipelineAsync(input, stringifier, res)
    } catch (err) {
      console.error("CSV export failed", err)
      res.status(500).send("CSV export failed")
    }
  },

  exportToExcel: async (res, data) => {
    const headers = [
      { v: "#", t: "s", w: "#" },
      { v: "Name", t: "s", w: "Name" },
      { v: "Price(NT.)", t: "s", w: "Price(NT.)" },
      { v: "Category", t: "s", w: "Category" },
      { v: "Quantity", t: "s", w: "Quantity" },
      { v: "Total Sales(NT.)", t: "s", w: "Total Sales(NT.)" },
    ]

    const ws = XLSX.utils.aoa_to_sheet([headers])

    XLSX.utils.sheet_add_json(ws, data, {
      origin: "A2",
      skipHeader: true,
      header: ["#", "Name", "Price", "Category", "Quantity", "Total Sales"],
    })

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report")

    const wscols = [{ wch: 5 }, { wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 30 }]
    ws["!cols"] = wscols

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" })
    res.setHeader("Content-Disposition", "attachment; filename=sales_report.xlsx")
    res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    res.send(excelBuffer)
  },
}
module.exports = exportServices
