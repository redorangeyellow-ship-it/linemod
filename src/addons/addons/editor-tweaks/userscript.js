// Editor Tweaks
// By: SharkPool

export default async function({ addon }) {
  const Blockly = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;

  // addon settings
  let checkboxesEnabled = true,
      expandableButtonSize = 1;

  // patch variables
  let ogCheckboxBlockInit = Blockly.Blocks.checkbox.init;
  let ogMutatorBuilder = Blockly.scratchBlocksUtils.generateMutatorShadow;

  // internals
  function updateAllBlocks(flyoutOnly) {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      if (!flyoutOnly && vm.editingTarget) vm.emitWorkspaceUpdate();
      const flyout = workspace.getFlyout();
      if (flyout) {
        const flyoutWorkspace = flyout.getWorkspace();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.workspaceToDom(flyoutWorkspace), flyoutWorkspace);
        if (!flyoutOnly) {
          workspace.getToolbox().refreshSelection();
          workspace.toolboxRefreshEnabled_ = true;
        }
      }
    }
  }

  function requestAddonState() {
    checkboxesEnabled = addon.settings.get("checkboxesEnabled");
    expandableButtonSize = addon.settings.get("expandableButtonSize") / 100;
    Blockly.Procedures.ADDON_SP_CHECKBOXES_DISABLED = !checkboxesEnabled;
  }

  function toggleCheckboxes() {
    Blockly.Blocks.checkbox.init = checkboxesEnabled ? ogCheckboxBlockInit : function(...args) {
      ogCheckboxBlockInit.call(this, ...args);
      this.useDragSurface_ = false;
      this.workspace = null;
    };

    Blockly.scratchBlocksUtils.generateMutatorShadow = checkboxesEnabled ? ogMutatorBuilder : function(...args) {
      if (args[1] === "checkbox") return;
      ogCheckboxBlockInit.call(this, ...args);
    };

    Blockly.Blocks["control_expandableIf"].fillInBlock = Blockly.scratchBlocksUtils.generateMutatorShadow;
  }

  function setExpandableSize() {
    // override these, ripped from the Blocks Repo with minor changes
    Blockly.Blocks['control_expandableIf'].fixupButtons = function () {
      const expandableInput = this.getInput("");
      this.inputList.splice(this.inputList.indexOf(expandableInput), 1);
      this.inputList.push(expandableInput);

      expandableInput.setAlign(1);
      const hiddenBtn = expandableInput.fieldRow[0];
      hiddenBtn.size_.width = 0.5;
      hiddenBtn.size_.height = (Blockly.BlockSvg.INPUT_SHAPE_HEIGHT + 16) * expandableButtonSize;
      hiddenBtn.setVisible(false);
    }

    const addImg = Blockly.FieldExpandableAdd.prototype.BTN_IMG;
    Blockly.FieldExpandableAdd.prototype.init = function() {
      if (this.fieldGroup_) return;
      Blockly.FieldExpandableAdd.superClass_.init.call(this);

      const ratio = (Blockly.BlockSvg.FIELD_HEIGHT / 32) * expandableButtonSize;
      this.size_.width = Blockly.BlockSvg.FIELD_HEIGHT * expandableButtonSize;
      this.size_.height *= expandableButtonSize;
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

      const ratio = (Blockly.BlockSvg.FIELD_HEIGHT / 32) * expandableButtonSize;
      this.size_.width = Blockly.BlockSvg.FIELD_HEIGHT * expandableButtonSize;
      this.size_.height *= expandableButtonSize;
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
  }

  addon.self.addEventListener("disabled", () => {
    checkboxesEnabled = true,
    expandableButtonSize = 1;
    toggleCheckboxes();
    setExpandableSize();
    updateAllBlocks(true);
  });
  addon.self.addEventListener("reenabled", () => {
    requestAddonState();
    toggleCheckboxes();
    setExpandableSize();
    updateAllBlocks(checkboxesEnabled);
  });
  
  addon.settings.addEventListener("change", () => {
    requestAddonState();
    toggleCheckboxes();
    setExpandableSize();
    updateAllBlocks(checkboxesEnabled);
  });

  requestAddonState();
  toggleCheckboxes();
  setExpandableSize();
  updateAllBlocks(checkboxesEnabled || expandableButtonSize !== 1);
}
