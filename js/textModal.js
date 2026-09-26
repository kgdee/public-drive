const TextModal = (() => {
  const element = document.querySelector(".text-modal");
  const titleEl = element.querySelector(".title");
  const nameInput = element.querySelector(".name-input");
  const iconInput = element.querySelector(".icon-input input");
  const iconPreview = element.querySelector(".icon-input img");
  const contentInput = element.querySelector(".content-input");
  const submitBtn = element.querySelector(".submit-btn");
  const deleteBtn = element.querySelector(".delete-btn");

  let currentItem = null;

  iconInput.oninput = (event) => {
    const file = event.target.files[0];
    iconPreview.src = URL.createObjectURL(file);
  };

  submitBtn.onclick = handleSubmit;
  deleteBtn.onclick = handleDelete;

  function openCreate() {
    update();
    open();
  }

  function openUpdate(itemId) {
    const item = getItem(itemId);
    currentItem = { ...item, name: removeExtension(item.name) };
    update();
    open();
  }

  function update() {
    iconInput.value = "";
    iconPreview.src = currentItem?.icon || `assets/images/file-text.png`;
    titleEl.textContent = currentItem ? `Edit ${currentItem.name}` : `Create new text`;
    nameInput.value = currentItem?.name || createItemName(`New text`, ".txt");
    contentInput.value = currentItem?.content || "";

    submitBtn.innerHTML = currentItem ? `Update` : `Create`;
    deleteBtn.classList.toggle("hidden", !currentItem);
  }

  async function handleSubmit() {
    const itemData = {
      name: `${nameInput.value}.txt`,
      folder: currentFolder.id,
      content: contentInput.value,
      icon: iconInput.value ? await handleImageFile(iconInput.files[0], 64) : currentItem?.icon || null,
      fileType: "text/plain",
    };
    if (currentItem) {
      itemData.id = currentItem.id
      updateFile(itemData)
    } else {
      createFile(itemData);
    }

    close();
  }

  async function handleDelete() {
    await deleteItem(currentItem.id);
    close();
  }

  function open() {
    element.classList.toggle("hidden", false);
  }

  function close() {
    element.classList.toggle("hidden", true);
    currentItem = null;
  }

  function listenText() {
    const text = contentInput.value.trim();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  async function copyText() {
    await navigator.clipboard.writeText(contentInput.value);
    Toast.show("Text copied successfully!");
  }

  return { openCreate, openUpdate, close, listenText, copyText };
})();
