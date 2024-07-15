const favoriteIcons = document.querySelectorAll(".favoriteIcon")

favoriteIcons.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    event.preventDefault()
    const form = icon.closest("form")
    const isFavorited = form.dataset.isFavorited === "true"
    const clotheId = form.getAttribute("action").split("/").pop()

    const url = isFavorited ? `/favorite/${clotheId}?_method=DELETE`:`/favorite/${clotheId}`
    const method = isFavorited ? "DELETE" : "POST"

    axios({
      url,
      method,
    })
      .then((response) => {
        if (response.data.success) {
          if (isFavorited) {
            form.dataset.isFavorited = "false"
            icon.style.color = "#b7bec8"
          } else {
            form.dataset.isFavorited = "true"
            icon.style.color = "#d7370f"
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
  })
})
