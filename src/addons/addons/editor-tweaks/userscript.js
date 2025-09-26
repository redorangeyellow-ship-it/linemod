// Editor Tweaks
// By: SharkPool

export default async function({ addon }) {
  const Blockly = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;

  // addon settings
  let oldCkbxEnabled, oldExpandBtnSz = 1
  let ckbxEnabled = true, expandBtnSz = 1;
  let workspaceRefreshCache = 0;

  // patch variables and functions
  const ogWS2Dom = Blockly.Xml.workspaceToDom;
  const ogMutatorBuilder = Blockly.scratchBlocksUtils.generateMutatorShadow;

  const fixedWorkspace2Dom = function(...args) {
    const dom = ogWS2Dom.call(this, ...args);
    if (!args[0].isFlyout) return dom;

    // we only want to edit the flyout
    const domArray = Array.from(dom.children);
    for (const item of domArray) {
      if (item.localName !== "block") continue;

      for (const input of Array.from(item.children)) {
        // clear checkboxes
        if (input.localName !== "value") continue;
        const shadow = input.firstChild;
        if (shadow.getAttribute("type") === "checkbox") shadow.remove();
      }
    }

    return dom;
  }

  // internals
  function updateAllBlocks(flyoutOnly) {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      if (!flyoutOnly && vm.editingTarget) vm.emitWorkspaceUpdate();
      const flyout = workspace.getFlyout();
      if (flyout) {
        const flyoutWorkspace = flyout.getWorkspace();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.workspaceToDom(flyoutWorkspace), flyoutWorkspace);
        workspace.getToolbox().refreshSelection();
        workspace.toolboxRefreshEnabled_ = true;
      }
    }
  }

  function requestAddonState() {
    ckbxEnabled = addon.settings.get("checkboxesEnabled");
    expandBtnSz = addon.settings.get("expandableButtonSize") / 100;
    Blockly.Procedures.ADDON_SP_CHECKBOXES_DISABLED = !ckbxEnabled;
  }

  function applyChanges() {
    requestAddonState();
    toggleCheckboxes();
    setExpandableSize();
    updateAllBlocks(2 > workspaceRefreshCache);
    workspaceRefreshCache = 0;
  }

  function toggleCheckboxes() {
    if (oldCkbxEnabled === ckbxEnabled) return;
    oldCkbxEnabled = ckbxEnabled;
    workspaceRefreshCache++;

    if (ckbxEnabled) Blockly.Xml.workspaceToDom = ogWS2Dom;
    else Blockly.Xml.workspaceToDom = fixedWorkspace2Dom;

    Blockly.scratchBlocksUtils.generateMutatorShadow = ckbxEnabled ? ogMutatorBuilder : function(...args) {
      if (args[1] === "checkbox") return;
      ogCheckboxBlockInit.call(this, ...args);
    };

    Blockly.Blocks["control_expandableIf"].fillInBlock = Blockly.scratchBlocksUtils.generateMutatorShadow;
  }

  function setExpandableSize() {
    if (oldExpandBtnSz === expandBtnSz) return;
    oldExpandBtnSz = expandBtnSz;
    workspaceRefreshCache = 2;

    // override these, ripped from the Blocks Repo with minor changes
    const addImg = Blockly.FieldExpandableAdd.prototype.BTN_IMG;
    Blockly.FieldExpandableAdd.prototype.init = function() {
      if (this.fieldGroup_) return;
      Blockly.FieldExpandableAdd.superClass_.init.call(this);

      const ratio = (Blockly.BlockSvg.FIELD_HEIGHT / 32) * expandBtnSz;
      this.size_.width = Blockly.BlockSvg.FIELD_HEIGHT * expandBtnSz;
      this.size_.height *= expandBtnSz;
      this.overrideSep = 1;
      this.boxGroup_ = Blockly.utils.createSvgElement('g', {}, null);
      this.box_ = Blockly.utils.createSvgElement('rect', {
          'x': 0,'y': 0, 'rx': 4, 'ry': 4,
          'width': this.size_.width, 'height': this.size_.height,
          'fill': "#00000000", 'stroke': "#00000035", 'cursor': this.CURSOR
        },
        this.boxGroup_
      );
      this.icon_ = Blockly.utils.createSvgElement('image', {
          'x': 5 * ratio, 'y': 5 * ratio,
          'width': this.size_.width / 1.5, 'height': this.size_.height / 1.5,
          'xlink:href': addImg, 'href': addImg,
        },
        this.boxGroup_
      );
      this.fieldGroup_.insertBefore(this.boxGroup_, this.textElement_);
    };

    const removeImg = Blockly.FieldExpandableRemove.prototype.BTN_IMG;
    Blockly.FieldExpandableRemove.prototype.init = function() {
      if (this.fieldGroup_) return;
      Blockly.FieldExpandableRemove.superClass_.init.call(this);

      const ratio = (Blockly.BlockSvg.FIELD_HEIGHT / 32) * expandBtnSz;
      this.size_.width = Blockly.BlockSvg.FIELD_HEIGHT * expandBtnSz;
      this.size_.height *= expandBtnSz;
      this.overrideSep = 1;
      this.boxGroup_ = Blockly.utils.createSvgElement('g', {}, null);
      this.box_ = Blockly.utils.createSvgElement('rect', {
          'x': 0, 'y': 0, 'rx': 4, 'ry': 4,
          'width': this.size_.width, 'height': this.size_.height,
          'fill': "#00000000", 'stroke': "#00000035", 'cursor': this.CURSOR
        },
        this.boxGroup_
      );
      this.icon_ = Blockly.utils.createSvgElement('image', {
          'x': 5 * ratio, 'y': 5 * ratio,
          'width': this.size_.width / 1.5, 'height': this.size_.height / 1.5,
          'xlink:href': removeImg, 'href': removeImg,
        },
        this.boxGroup_
      );
      this.fieldGroup_.insertBefore(this.boxGroup_, this.textElement_);
    };

    // fix block chin height
    Blockly.Blocks['control_expandableIf'].fixupButtons = function() {
      const expandableInput = this.getInput("");
      this.inputList.splice(this.inputList.indexOf(expandableInput), 1);
      this.inputList.push(expandableInput);

      expandableInput.setAlign(1);
      const hiddenBtn = expandableInput.fieldRow[0];
      hiddenBtn.size_.width = 0.5;
      hiddenBtn.size_.height = (Blockly.BlockSvg.INPUT_SHAPE_HEIGHT + 16) * expandBtnSz;
      hiddenBtn.setVisible(false);
    }
  }

  addon.self.addEventListener("reenabled", applyChanges);
  addon.settings.addEventListener("change", applyChanges);
  addon.self.addEventListener("disabled", () => {
    ckbxEnabled = true,
    expandBtnSz = 1;
    applyChanges();
  });

  applyChanges();
}
