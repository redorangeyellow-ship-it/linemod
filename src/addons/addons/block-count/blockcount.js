export default async function ({ addon, console, msg }) {
  const Blockly = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;

  let counterElement;

  const getBlockCount = () => {
    let blockCount = 0;
    const targetBlocks = vm.runtime.targets.map((target) => {
      return [
        target.id,
        Object.values(target.blocks._blocks)
          .filter((b) => !b.shadow).length // shadow blocks should be filtered out
      ];
    });

    // project block count
    for (const info of targetBlocks) blockCount += info[1];
    return blockCount;
  };

  const addCounter = () => {
    ReduxStore.subscribe(() => {
      if (!counterElement) {
        // init counter
        const topBar = document.querySelector("div[class^='menu-bar_main-menu']");
        if (!topBar) return;

        counterElement = topBar.appendChild(document.createElement("span"));
        counterElement.style.order = 1;
        counterElement.style.padding = "9px";
        counterElement.innerText = "0 blocks";

        addLiveBlockCount();
      } else {
        // hide display if not in editor
        const state = ReduxStore.getState().scratchGui;
        counterElement.style.display = state.mode.isPlayerOnly ? "none" : "";
      }
    });
  }

  const updateText = () => {
    const count = getBlockCount();
    counterElement.innerText = count + (count > 1 ? " blocks" : " block");
  };

  const addLiveBlockCount = () => {
    let lastWorkspaceID;
    let lastUpdateTime = 0;
    vm.on("workspaceUpdate", () => queueMicrotask(() => {
      updateText();
      const workspace = Blockly.mainWorkspace;
      const events = Blockly.Events;

      const blocklyHandler = (event) => {
        const now = Date.now();
        if (
          counterElement &&
          now > lastUpdateTime + 150 && // dont update the count multiple times in a second
          (event.type === events.DELETE || event.type === events.CREATE)
        ) {
          lastUpdateTime = now;
          setTimeout(updateText, 1000);
        }
      };

      if (lastWorkspaceID !== workspace.id) {
        workspace.addChangeListener(blocklyHandler);
        lastWorkspaceID = workspace.id;
      }
    }));
  };

  addCounter();
}
