// Grabbing the image url from the journal entry
function _onDragStart(event) {
  event.stopPropagation();
  let url = event.srcElement.style.backgroundImage
    .slice(4, -1)
    .replace(/"/g, "");
  const dragData = { type: "image", src: url };
  event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
}

// Create the tile with the gathered informations
async function _onDropImage(event, data) {
  if (data.type == "image") {
    let tileData = {
      img: data.src
    };

    // Determine the tile size
    const tex = await loadTexture(data.src);
    tileData.width = tex.width;
    tileData.height = tex.height;
    
    // Project tile position
    let t = canvas.tiles.worldTransform;
    tileData.x = (event.clientX - t.tx) / canvas.stage.scale.x,
    tileData.y = (event.clientY - t.ty) / canvas.stage.scale.y,
    Tile.create(tileData);
  }
}

// Add the listener to the board html element
Hooks.once("canvasReady", (_) => {
  document.getElementById("board").addEventListener("drop", (event) => {
    // Try to extract the data (type + src)
    let data;
    try {
      data = JSON.parse(event.dataTransfer.getData("text/plain"));
    } catch (err) {
      return;
    }
    // Create the tile
    _onDropImage(event, data);
  });
});

// Add the listener for draggable event from the journal image
Hooks.on("renderJournalSheet", (sheet, html, data) => {
  html.find(".lightbox-image").each((i, div) => {
    div.setAttribute("draggable", "true");
    div.addEventListener("dragstart", _onDragStart, false);
  });
});
