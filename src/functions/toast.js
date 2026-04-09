export const showToast = (message, type = "success", duration = 3000) => {
    const toastContainer = document.getElementById("toast-container");

    if (!toastContainer) {
        console.warn("Toast container not found");
        return;
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, duration);
};
