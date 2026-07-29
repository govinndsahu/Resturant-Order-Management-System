function InstallButton(menuName) {
  const handleClick = () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.finally(() => {
        window.deferredPrompt = null;
      });
    }
  };

  return (
    <button id="install-button" type="button" onClick={handleClick}>
      Install {menuName}
    </button>
  );
}

export default InstallButton;
