export default async function ({ addon, console, msg }) {
  const Blockly = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;

  let counterElement;

  const getBlockCount = () => {
    let allBlockCount = 0; // number of blocks in project
    let thisBlockCount = 0; // number of blocks in this sprite

    const targetBlocks = vm.runtime.targets.map((target) => {
      return [
        target.id,
        Object.values(target.blocks._blocks)
          .filter((b) => !b.shadow).length // shadow blocks should be filtered out
      ];
    });

    // project block count
    for (const info of targetBlocks) allBlockCount += info[1];

    // this sprite's block count
    const thisTargetID = vm.editingTarget?.id;
    const thisWS = targetBlocks.find((i) => i[0] === thisTargetID);
    if (thisWS) thisBlockCount += thisWS[1];

    if (thisBlockCount === allBlockCount) return allBlockCount;
    return `${thisBlockCount} / ${allBlockCount}`;
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

        addLiveBlockCount();
      } else {
        // hide display if not in editor
        const state = ReduxStore.getState().scratchGui;
        counterElement.style.display = state.mode.isPlayerOnly ? "none" : "";
      }
    });
  }

  const addLiveBlockCount = () => {
    let lastWorkspaceID;
    let lastUpdateTime = 0;
    vm.on("workspaceUpdate", () => {
      const workspace = Blockly.mainWorkspace;
      const events = Blockly.Events;

      const blocklyHandler = (event) => {
        const now = Date.now();
        if (
          counterElement &&
          now > lastUpdateTime + 1000 && // dont update the count multiple times in a second
          (event.type === events.DELETE || event.type === events.CREATE)
        ) {
          lasUpdateTime = now;
          counterElement.innerText = msg("blocks", { num: getBlockCount() });
        }
      };

      if (lastWorkspaceID !== workspace.id) {
        workspace.addChangeListener(blocklyHandler);
        lastWorkspaceID = workspace.id;
      }
    });
  };

  addCounter();
}
