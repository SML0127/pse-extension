$(function () {
	// init bootstrap alerts

	new Controller({
	});
});

var Controller = function (options) {
	for (var i in options) {
		this[i] = options[i];
	}
	this.init();
};



Controller.prototype = {

	backgroundScript: getBackgroundScript("DevTools"),
	contentScript: getContentScript('DevTools'),


	control: function (controls) {
		var controller = this;
		for (var selector in controls) {
			for (var event in controls[selector]) {
				$(document).on(event, selector, (function (selector, event) {
					return function () {
						var continueBubbling = controls[selector][event].call(controller, this);
						if (continueBubbling !== true) {
							return false;
						}
					}
				})(selector, event));
			}
		}
	},

	/**
	 * Loads templates for ICanHaz
	 */
	loadTemplates: function (cbAllTemplatesLoaded) {
		var templateIds = [
//			'Viewport',
//			'SelectorList',
//			'SelectorListItem',
  			'SelectorEdit'
//			'SelectorEditTableColumn',
//			'SitemapSelectorGraph',
//			'DataPreview',
		];
		var templatesLoaded = 0;
		//var cbLoaded = function (templateId, template) {
    //  console.log("???????/")
		//	templatesLoaded++;
		//	ich.addTemplate(templateId, template);
		//	if (templatesLoaded === templateIds.length) {
		//		cbAllTemplatesLoaded();
		//	}
		//}

		//templateIds.forEach(function (templateId) {
    //  console.log(templateId + '.html')
    //  cbLoaded(templateId +'.html')
		//	$.get(templateId + '.html', cbLoaded.bind(this, templateId));
		//}.bind(this));
		//ich.addTemplate('SelectorEdit', $.get('SelectorEdit.html'));
    cbAllTemplatesLoaded();
	},

	init: function () {
		this.loadTemplates(function () {
			// cancel all form submits
			$("form").bind("submit", function () {
				return false;
			});

		  //this.selectSelector()
		  //this.otips()

			this.control({
				"#edit-selector Button[action=otips]": {
					click: this.otips
				},
				"#edit-selector Button[action=unbind-otips]": {
					click: this.unbind_otips
				},
				"Button[action=get_document_by_values]": {
					click: this.get_document_by_values
				},
				"Button[action=get_document_by_lists]": {
					click: this.get_document_by_lists
				},
				"Button[action=get_document_by_dictionaries]": {
					click: this.get_document_by_dictionaries
				},
				"Button[action=get_document_by_option_list]": {
					click: this.get_document_by_option_list
				},
				"Button[action=get_document_by_option_matrix]": {
					click: this.get_document_by_option_matrix
				},
				"#edit-selector Button[action=select-selector]": {
					click: this.selectSelector
				},
				"#edit-selector Button[action=select-selector-url]": {
					click: this.selectSelectorURL
				}

			});
			//this.showSitemaps();
		}.bind(this));
	},

//	clearState: function () {
//		this.state = {
//			// sitemap that is currently open
//			currentSitemap: null,
//			// selector ids that are shown in the navigation
//			editSitemapBreadcumbsSelectors: null,
//			currentParentSelectorId: null,
//			currentSelector: null
//		};
//	},
//
	setStateEditSitemap: function (sitemap) {
		this.state.currentSitemap = sitemap;
		this.state.editSitemapBreadcumbsSelectors = [
			{id: '_root'}
		];
		this.state.currentParentSelectorId = '_root';
	},
//
//	setActiveNavigationButton: function (navigationId) {
//		$(".nav .active").removeClass("active");
//		$("#" + navigationId + "-nav-button").closest("li").addClass("active");
//
//		if (navigationId.match(/^sitemap-/)) {
//			$("#sitemap-nav-button").removeClass("disabled");
//			$("#sitemap-nav-button").closest("li").addClass('active');
//			$("#navbar-active-sitemap-id").text("(" + this.state.currentSitemap._id + ")");
//		}
//		else {
//			$("#sitemap-nav-button").addClass("disabled");
//			$("#navbar-active-sitemap-id").text("");
//		}
//
//		if (navigationId.match(/^create-sitemap-/)) {
//			$("#create-sitemap-nav-button").closest("li").addClass('active');
//		}
//	},
//
//	/**
//	 * Simple info popup for sitemap start url input field
//	 */
//	initMultipleStartUrlHelper: function () {
//		$("#startUrl")
//			.popover({
//				title: 'Multiple start urls',
//				html: true,
//				content: "You can create ranged start urls like this:<br />http://example.com/[1-100].html",
//				placement: 'bottom'
//			})
//			.blur(function () {
//				$(this).popover('hide');
//			});
//	},
//
//	/**
//	 * Returns bootstrapValidator object for current form in viewport
//	 */
//	getFormValidator: function() {
//
//		var validator = $('#viewport form').data('bootstrapValidator');
//		return validator;
//	},
//
//	/**
//	 * Returns whether current form in the viewport is valid
//	 * @returns {Boolean}
//	 */
//	isValidForm: function() {
//		var validator = this.getFormValidator();
//
//		//validator.validate();
//		// validate method calls submit which is not needed in this case.
//		for (var field in validator.options.fields) {
//			validator.validateField(field);
//		}
//
//		var valid = validator.isValid();
//		return valid;
//	},
//
//	/**
//	 * Add validation to sitemap creation or editing form
//	 */
//	initSitemapValidation: function() {
//
//		$('#viewport form').bootstrapValidator({
//			fields: {
//				"_id": {
//					validators: {
//						notEmpty: {
//							message: 'The sitemap id is required and cannot be empty'
//						},
//						stringLength: {
//							min: 3,
//							message: 'The sitemap id should be atleast 3 characters long'
//						},
//						regexp: {
//							regexp: /^[a-z][a-z0-9_\$\(\)\+\-/]+$/,
//							message: 'Only lowercase characters (a-z), digits (0-9), or any of the characters _, $, (, ), +, -, and / are allowed. Must begin with a letter.'
//						},
//						// placeholder for sitemap id existance validation
//						callback: {
//							message: 'Sitemap with this id already exists',
//							callback: function(value, validator) {
//								return true;
//							}.bind(this)
//						}
//					}
//				},
//				"startUrl[]": {
//					validators: {
//						notEmpty: {
//							message: 'The start URL is required and cannot be empty'
//						},
//						uri: {
//							message: 'The start URL is not a valid URL'
//						}
//					}
//				}
//			}
//		});
//	},
//
//	showCreateSitemap: function () {
//		this.setActiveNavigationButton('create-sitemap-create');
//		var sitemapForm = ich.SitemapCreate();
//		$("#viewport").html(sitemapForm);
//		this.initMultipleStartUrlHelper();
//		this.initSitemapValidation();
//
//		return true;
//	},
//
//	initImportStiemapValidation: function(){
//		$('#viewport form').bootstrapValidator({
//			fields: {
//				"_id": {
//					validators: {
//						stringLength: {
//							min: 3,
//							message: 'The sitemap id should be atleast 3 characters long'
//						},
//						regexp: {
//							regexp: /^[a-z][a-z0-9_\$\(\)\+\-/]+$/,
//							message: 'Only lowercase characters (a-z), digits (0-9), or any of the characters _, $, (, ), +, -, and / are allowed. Must begin with a letter.'
//						},
//						// placeholder for sitemap id existance validation
//						callback: {
//							message: 'Sitemap with this id already exists',
//							callback: function(value, validator) {
//								return true;
//							}.bind(this)
//						}
//					}
//				},
//				sitemapJSON: {
//					validators: {
//						notEmpty: {
//							message: 'Sitemap JSON is required and cannot be empty'
//						},
//						callback: {
//							message: 'JSON is not valid',
//							callback: function(value, validator) {
//								try {
//									JSON.parse(value);
//								} catch (e) {
//									return false;
//								}
//								return true;
//							}.bind(this)
//						}
//					}
//				}
//			}
//		});
//	},
//
//	showImportSitemapPanel: function () {
//		this.setActiveNavigationButton('create-sitemap-import');
//		var sitemapForm = ich.SitemapImport();
//		$("#viewport").html(sitemapForm);
//		this.initImportStiemapValidation();
//		return true;
//	},
//
//	showSitemapExportPanel: function () {
//		this.setActiveNavigationButton('sitemap-export');
//		var sitemap = this.state.currentSitemap;
//		var sitemapJSON = sitemap.exportSitemap();
//		var sitemapExportForm = ich.SitemapExport({
//			sitemapJSON: sitemapJSON
//		});
//		$("#viewport").html(sitemapExportForm);
//		return true;
//	},
//
//	showSitemaps: function () {
//
//		this.clearState();
//		this.setActiveNavigationButton("sitemaps");
//
//		this.store.getAllSitemaps(function (sitemaps) {
//			$sitemapListPanel = ich.SitemapList();
//			sitemaps.forEach(function (sitemap) {
//				$sitemap = ich.SitemapListItem(sitemap);
//				$sitemap.data("sitemap", sitemap);
//				$sitemapListPanel.find("tbody").append($sitemap);
//			});
//			$("#viewport").html($sitemapListPanel);
//		});
//	},
//
//	getSitemapFromMetadataForm: function(){
//
//		var id = $("#viewport form input[name=_id]").val();
//		var $startUrlInputs = $("#viewport form .input-start-url");
//		var startUrl;
//		if($startUrlInputs.length === 1) {
//			startUrl = $startUrlInputs.val();
//		}
//		else {
//			startUrl = [];
//			$startUrlInputs.each(function(i, element) {
//				startUrl.push($(element).val());
//			});
//		}
//
//		return {
//			id:id,
//			startUrl:startUrl
//		};
//	},
//
//	createSitemap: function (form) {
//
//		// cancel submit if invalid form
//		if(!this.isValidForm()) {
//			return false;
//		}
//
//		var sitemapData = this.getSitemapFromMetadataForm();
//
//		// check whether sitemap with this id already exist
//		this.store.sitemapExists(sitemapData.id, function (sitemapExists) {
//			if(sitemapExists) {
//				var validator = this.getFormValidator();
//				validator.updateStatus('_id', 'INVALID', 'callback');
//			}
//			else {
//				var sitemap = new Sitemap({
//					_id: sitemapData.id,
//					startUrl: sitemapData.startUrl,
//					selectors: []
//				});
//				this.store.createSitemap(sitemap, function (sitemap) {
//					this._editSitemap(sitemap, ['_root']);
//				}.bind(this, sitemap));
//			}
//
//		}.bind(this));
//	},
//
//	importSitemap: function () {
//
//		// cancel submit if invalid form
//		if(!this.isValidForm()) {
//			return false;
//		}
//
//		// load data from form
//		var sitemapJSON = $("[name=sitemapJSON]").val();
//		var id = $("input[name=_id]").val();
//		var sitemap = new Sitemap();
//		sitemap.importSitemap(sitemapJSON);
//		if(id.length) {
//			sitemap._id = id;
//		}
//		// check whether sitemap with this id already exist
//		this.store.sitemapExists(sitemap._id, function (sitemapExists) {
//			if(sitemapExists) {
//				var validator = this.getFormValidator();
//				validator.updateStatus('_id', 'INVALID', 'callback');
//			}
//			else {
//				this.store.createSitemap(sitemap, function (sitemap) {
//					this._editSitemap(sitemap, ['_root']);
//				}.bind(this, sitemap));
//			}
//		}.bind(this));
//	},
//
//	editSitemapMetadata: function (button) {
//
//		this.setActiveNavigationButton('sitemap-edit-metadata');
//
//		var sitemap = this.state.currentSitemap;
//		var $sitemapMetadataForm = ich.SitemapEditMetadata(sitemap);
//		$("#viewport").html($sitemapMetadataForm);
//		this.initMultipleStartUrlHelper();
//		this.initSitemapValidation();
//
//		return true;
//	},
//
//	editSitemapMetadataSave: function (button) {
//		var sitemap = this.state.currentSitemap;
//		var sitemapData = this.getSitemapFromMetadataForm();
//
//		// cancel submit if invalid form
//		if(!this.isValidForm()) {
//			return false;
//		}
//
//		// check whether sitemap with this id already exist
//		this.store.sitemapExists(sitemapData.id, function (sitemapExists) {
//			if(sitemap._id !== sitemapData.id && sitemapExists) {
//				var validator = this.getFormValidator();
//				validator.updateStatus('_id', 'INVALID', 'callback');
//				return;
//			}
//
//			// change data
//			sitemap.startUrl = sitemapData.startUrl;
//
//			// just change sitemaps url
//			if (sitemapData.id === sitemap._id) {
//				this.store.saveSitemap(sitemap, function (sitemap) {
//					this.showSitemapSelectorList();
//				}.bind(this));
//			}
//			// id changed. we need to delete the old one and create a new one
//			else {
//				var newSitemap = new Sitemap(sitemap);
//				var oldSitemap = sitemap;
//				newSitemap._id = sitemapData.id;
//				this.store.createSitemap(newSitemap, function (newSitemap) {
//					this.store.deleteSitemap(oldSitemap, function () {
//						this.state.currentSitemap = newSitemap;
//						this.showSitemapSelectorList();
//					}.bind(this));
//				}.bind(this));
//			}
//
//		}.bind(this));
//	},
//
//	/**
//	 * Callback when sitemap edit button is clicked in sitemap grid
//	 */
//	editSitemap: function (tr) {
//
//		var sitemap = $(tr).data("sitemap");
//		this._editSitemap(sitemap);
//	},
//	_editSitemap: function (sitemap) {
//		this.setStateEditSitemap(sitemap);
//		this.setActiveNavigationButton("sitemap");
//
//		this.showSitemapSelectorList();
//	},
//	showSitemapSelectorList: function () {
//
//		this.setActiveNavigationButton('sitemap-selector-list');
//
//		var sitemap = this.state.currentSitemap;
//		var parentSelectors = this.state.editSitemapBreadcumbsSelectors;
//		var parentSelectorId = this.state.currentParentSelectorId;
//
//		var $selectorListPanel = ich.SelectorList({
//			parentSelectors: parentSelectors
//		});
//		var selectors = sitemap.getDirectChildSelectors(parentSelectorId);
//		selectors.forEach(function (selector) {
//			$selector = ich.SelectorListItem(selector);
//			$selector.data("selector", selector);
//			$selectorListPanel.find("tbody").append($selector);
//		});
//		$("#viewport").html($selectorListPanel);
//
//		return true;
//	},
//	showSitemapSelectorGraph: function () {
//		this.setActiveNavigationButton('sitemap-selector-graph');
//		var sitemap = this.state.currentSitemap;
//		var $selectorGraphPanel = ich.SitemapSelectorGraph();
//		$("#viewport").html($selectorGraphPanel);
//		var graphDiv = $("#selector-graph")[0];
//		var graph = new SelectorGraphv2(sitemap);
//		graph.draw(graphDiv, $(document).width(), 200);
//		return true;
//	},
//	showChildSelectors: function (tr) {
//		var selector = $(tr).data('selector');
//		var parentSelectors = this.state.editSitemapBreadcumbsSelectors;
//		this.state.currentParentSelectorId = selector.id;
//		parentSelectors.push(selector);
//
//		this.showSitemapSelectorList();
//	},
//
//	treeNavigationshowSitemapSelectorList: function (button) {
//		var parentSelectors = this.state.editSitemapBreadcumbsSelectors;
//		var controller = this;
//		$("#selector-tree .breadcrumb li a").each(function (i, parentSelectorButton) {
//			if (parentSelectorButton === button) {
//				parentSelectors.splice(i + 1);
//				controller.state.currentParentSelectorId = parentSelectors[i].id;
//			}
//		});
//		this.showSitemapSelectorList();
//	},
//
//	initSelectorValidation: function() {
//
//		$('#viewport form').bootstrapValidator({
//			fields: {
//				"id": {
//					validators: {
//						notEmpty: {
//							message: 'Sitemap id required and cannot be empty'
//						},
//						stringLength: {
//							min: 3,
//							message: 'The sitemap id should be atleast 3 characters long'
//						},
//						regexp: {
//							regexp: /^[^_].*$/,
//							message: 'Selector id cannot start with an underscore _'
//						}
//					}
//				},
//				selector: {
//					validators: {
//						notEmpty: {
//							message: 'Selector is required and cannot be empty'
//						}
//					}
//				},
//				regex: {
//					validators: {
//						callback: {
//							message: 'JavaScript does not support regular expressions that can match 0 characters.',
//							callback: function(value, validator) {
//								// allow no regex
//								if(!value) {
//									return true;
//								}
//
//								var matches = "".match(new RegExp(value));
//								if(matches !== null && matches[0] === "") {
//									return false;
//								}
//								else {
//									return true;
//								}
//							}
//						}
//					}
//				},
//				clickElementSelector: {
//					validators: {
//						notEmpty: {
//							message: 'Click selector is required and cannot be empty'
//						}
//					}
//				},
//				tableHeaderRowSelector: {
//					validators: {
//						notEmpty: {
//							message: 'Header row selector is required and cannot be empty'
//						}
//					}
//				},
//				tableDataRowSelector: {
//					validators: {
//						notEmpty: {
//							message: 'Data row selector is required and cannot be empty'
//						}
//					}
//				},
//				delay: {
//					validators: {
//						numeric: {
//							message: 'Delay must be numeric'
//						}
//					}
//				},
//				parentSelectors: {
//					validators: {
//						notEmpty: {
//							message: 'You must choose at least one parent selector'
//						},
//						callback: {
//							message: 'Cannot handle recursive element selectors',
//							callback: function(value, validator, $field) {
//
//								var sitemap = this.getCurrentlyEditedSelectorSitemap();
//								return !sitemap.selectors.hasRecursiveElementSelectors();
//
//							}.bind(this)
//						}
//					}
//				}
//			}
//		});
//	},
//	editSelector: function (button) {
//		var selector = $(button).closest("tr").data('selector');
//		this._editSelector(selector);
//	},
//	updateSelectorParentListOnIdChange: function() {
//
//		var selector = this.getCurrentlyEditedSelector();
//		$(".currently-edited").val(selector.id).text(selector.id);
//	},
//	_editSelector: function (selector) {
//
//		var sitemap = this.state.currentSitemap;
//		var selectorIds = sitemap.getPossibleParentSelectorIds();
//
//		var $editSelectorForm = ich.SelectorEdit({
//			selector: selector,
//			selectorIds: selectorIds,
//			selectorTypes: [
//				{
//					type: 'SelectorText',
//					title: 'Text'
//				},
//				{
//					type: 'SelectorLink',
//					title: 'Link'
//				},
//				{
//					type: 'SelectorPopupLink',
//					title: 'Popup Link'
//				},
//				{
//					type: 'SelectorImage',
//					title: 'Image'
//				},
//				{
//					type: 'SelectorTable',
//					title: 'Table'
//				},
//				{
//					type: 'SelectorElementAttribute',
//					title: 'Element attribute'
//				},
//				{
//					type: 'SelectorHTML',
//					title: 'HTML'
//				},
//				{
//					type: 'SelectorElement',
//					title: 'Element'
//				},
//				{
//					type: 'SelectorElementScroll',
//					title: 'Element scroll down'
//				},
//				{
//					type: 'SelectorElementClick',
//					title: 'Element click'
//				},
//				{
//					type: 'SelectorGroup',
//					title: 'Grouped'
//				}
//			]
//		});
//		$("#viewport").html($editSelectorForm);
//		// mark initially opened selector as currently edited
//		$("#edit-selector #parentSelectors option").each(function(i, element) {
//			if($(element).val() === selector.id) {
//				$(element).addClass("currently-edited");
//			}
//		});
//
//		// set clickType
//		if(selector.clickType) {
//			$editSelectorForm.find("[name=clickType]").val(selector.clickType);
//		}
//		// set clickElementUniquenessType
//		if(selector.clickElementUniquenessType) {
//			$editSelectorForm.find("[name=clickElementUniquenessType]").val(selector.clickElementUniquenessType);
//		}
//
//		// handle selects seperately
//		$editSelectorForm.find("[name=type]").val(selector.type);
//		selector.parentSelectors.forEach(function (parentSelectorId) {
//			$editSelectorForm.find("#parentSelectors [value='" + parentSelectorId + "']").attr("selected", "selected");
//		});
//
//		this.state.currentSelector = selector;
//		this.selectorTypeChanged();
//		this.initSelectorValidation();
//	},
//	selectorTypeChanged: function () {
//		var type = $("#edit-selector select[name=type]").val();
//		var features = window[type].getFeatures();
//		$("#edit-selector .feature").hide();
//		features.forEach(function (feature) {
//			$("#edit-selector .feature-" + feature).show();
//		});
//
//		// add this selector to possible parent selector
//		var selector = this.getCurrentlyEditedSelector();
//		if(selector.canHaveChildSelectors()) {
//			if($("#edit-selector #parentSelectors .currently-edited").length === 0) {
//				var $option = $('<option class="currently-edited"></option>');
//				$option.text(selector.id).val(selector.id);
//				$("#edit-selector #parentSelectors").append($option);
//			}
//		}
//		// remove if type doesn't allow to have child selectors
//		else {
//			$("#edit-selector #parentSelectors .currently-edited").remove();
//		}
//	},
//	saveSelector: function (button) {
//
//		var sitemap = this.state.currentSitemap;
//		var selector = this.state.currentSelector;
//		var newSelector = this.getCurrentlyEditedSelector();
//
//		// cancel submit if invalid form
//		if(!this.isValidForm()) {
//			return false;
//		}
//
//		// cancel possible element selection
//		this.contentScript.removeCurrentContentSelector().done(function(){
//			sitemap.updateSelector(selector, newSelector);
//
//			this.store.saveSitemap(sitemap, function () {
//				this.showSitemapSelectorList();
//			}.bind(this));
//		}.bind(this));
//	},
//	/**
//	 * Get selector from selector editing form
//	 */
	getCurrentlyEditedSelector: function () {
		var id = $("#edit-selector [name=id]").val();
		var selectorsSelector = $("#edit-selector [name=selector]").val();
		var tableDataRowSelector = $("#edit-selector [name=tableDataRowSelector]").val();
		var tableHeaderRowSelector = $("#edit-selector [name=tableHeaderRowSelector]").val();
		var clickElementSelector = $("#edit-selector [name=clickElementSelector]").val();
		var type = $("#edit-selector [name=type]").val();
		var clickElementUniquenessType = $("#edit-selector [name=clickElementUniquenessType]").val();
		var clickType = $("#edit-selector [name=clickType]").val();
		var discardInitialElements = $("#edit-selector [name=discardInitialElements]").is(":checked");
		var multiple = $("#edit-selector [name=multiple]").is(":checked");
		var downloadImage = $("#edit-selector [name=downloadImage]").is(":checked");
		var clickPopup = $("#edit-selector [name=clickPopup]").is(":checked");
		var regex = $("#edit-selector [name=regex]").val();
		var delay = $("#edit-selector [name=delay]").val();
		var extractAttribute = $("#edit-selector [name=extractAttribute]").val();
		var parentSelectors = $("#edit-selector [name=parentSelectors]").val();
		var columns = [];
		var $columnHeaders = $("#edit-selector .column-header");
		var $columnNames = $("#edit-selector .column-name");
		var $columnExtracts = $("#edit-selector .column-extract");

		$columnHeaders.each(function(i){
			var header = $($columnHeaders[i]).val();
			var name = $($columnNames[i]).val();
			var extract = $($columnExtracts[i]).is(":checked");
			columns.push({
				header:header,
				name:name,
				extract:extract
			});
		});
//
//		var newSelector = new Selector({
//			id: id,
//			selector: selectorsSelector,
//			tableHeaderRowSelector: tableHeaderRowSelector,
//			tableDataRowSelector: tableDataRowSelector,
//			clickElementSelector: clickElementSelector,
//			clickElementUniquenessType: clickElementUniquenessType,
//			clickType: clickType,
//			discardInitialElements: discardInitialElements,
//			type: type,
//			multiple: multiple,
//			downloadImage: downloadImage,
//			clickPopup: clickPopup,
//			regex: regex,
//			extractAttribute:extractAttribute,
//			parentSelectors: parentSelectors,
//			columns:columns,
//			delay:delay
//		});
//		return newSelector;
	},
	/**
	 * @returns {Sitemap|*} Cloned Sitemap with currently edited selector
	 */
	getCurrentlyEditedSelectorSitemap: function () {
		var sitemap = this.state.currentSitemap.clone();
		var selector = sitemap.getSelectorById(this.state.currentSelector.id);
		var newSelector = this.getCurrentlyEditedSelector();
		sitemap.updateSelector(selector, newSelector);
		return sitemap;
	},
//	cancelSelectorEditing: function (button) {
//
//		// cancel possible element selection
//		this.contentScript.removeCurrentContentSelector().done(function() {
//			this.showSitemapSelectorList();
//		}.bind(this));
//	},
//	addSelector: function () {
//
//		var parentSelectorId = this.state.currentParentSelectorId;
//		var sitemap = this.state.currentSitemap;
//
//		var selector = new Selector({
//			parentSelectors: [parentSelectorId],
//			type: 'SelectorText',
//			multiple: false
//		});
//
//		this._editSelector(selector, sitemap);
//	},
//	deleteSelector: function (button) {
//
//		var sitemap = this.state.currentSitemap;
//		var selector = $(button).closest("tr").data('selector');
//		sitemap.deleteSelector(selector);
//
//		this.store.saveSitemap(sitemap, function () {
//			this.showSitemapSelectorList();
//		}.bind(this));
//	},
//	deleteSitemap: function (button) {
//		var sitemap = $(button).closest("tr").data("sitemap");
//		var controller = this;
//		this.store.deleteSitemap(sitemap, function () {
//			controller.showSitemaps();
//		});
//	},
//	initScrapeSitemapConfigValidation: function(){
//
//		$('#viewport form').bootstrapValidator({
//			fields: {
//				"requestInterval": {
//					validators: {
//						notEmpty: {
//							message: 'The request interval is required and cannot be empty'
//						},
//						numeric: {
//							message: 'The request interval must be numeric'
//						},
//						callback: {
//							message: 'The request interval must be atleast 2000 milliseconds',
//							callback: function(value, validator) {
//								return value >= 2000;
//							}
//						}
//					}
//				},
//				"pageLoadDelay": {
//					validators: {
//						notEmpty: {
//							message: 'The page load delay is required and cannot be empty'
//						},
//						numeric: {
//							message: 'The page laod delay must be numeric'
//						},
//						callback: {
//							message: 'The page load delay must be atleast 500 milliseconds',
//							callback: function(value, validator) {
//								return value >= 500;
//							}
//						}
//					}
//				}
//			}
//		});
//	},
//	showScrapeSitemapConfigPanel: function() {
//
//		this.setActiveNavigationButton('sitemap-scrape');
//		var scrapeConfigPanel = ich.SitemapScrapeConfig();
//		$("#viewport").html(scrapeConfigPanel);
//		this.initScrapeSitemapConfigValidation();
//		return true;
//	},
//	scrapeSitemap: function () {
//
//		if(!this.isValidForm()) {
//			return false;
//		}
//
//		var requestInterval = $("input[name=requestInterval]").val();
//		var pageLoadDelay = $("input[name=pageLoadDelay]").val();
//
//		var sitemap = this.state.currentSitemap;
//		var request = {
//			scrapeSitemap: true,
//			sitemap: JSON.parse(JSON.stringify(sitemap)),
//			requestInterval: requestInterval,
//			pageLoadDelay: pageLoadDelay
//		};
//
//		// show sitemap scraping panel
//		this.getFormValidator().destroy();
//		$(".scraping-in-progress").removeClass("hide");
//		$("#submit-scrape-sitemap").closest(".form-group").hide();
//		$("#scrape-sitemap-config input").prop('disabled', true);
//
//		chrome.runtime.sendMessage(request, function (response) {
//			this.browseSitemapData();
//		}.bind(this));
//		return false;
//	},
//	sitemapListBrowseSitemapData: function (button) {
//		var sitemap = $(button).closest("tr").data("sitemap");
//		this.setStateEditSitemap(sitemap);
//		this.browseSitemapData();
//	},
//	browseSitemapData: function () {
//		this.setActiveNavigationButton('sitemap-browse');
//		var sitemap = this.state.currentSitemap;
//		this.store.getSitemapData(sitemap, function (data) {
//
//			var dataColumns = sitemap.getDataColumns();
//
//			var dataPanel = ich.SitemapBrowseData({
//				columns: dataColumns
//			});
//			$("#viewport").html(dataPanel);
//
//			// display data
//			// Doing this the long way so there aren't xss vulnerubilites 
//			// while working with data or with the selector titles
//			var $tbody = $("#sitemap-data tbody");
//			data.forEach(function (row) {
//				var $tr = $("<tr></tr>");
//				dataColumns.forEach(function (column) {
//					var $td = $("<td></td>");
//					var cellData = row[column];
//					if (typeof cellData === 'object') {
//						cellData = JSON.stringify(cellData);
//					}
//					$td.text(cellData);
//					$tr.append($td);
//				});
//				$tbody.append($tr);
//			});
//		}.bind(this));
//
//		return true;
//	},
//
//	showSitemapExportDataCsvPanel: function () {
//		this.setActiveNavigationButton('sitemap-export-data-csv');
//
//		var sitemap = this.state.currentSitemap;
//		var exportPanel = ich.SitemapExportDataCSV(sitemap);
//		$("#viewport").html(exportPanel);
//
//		// generate data
//		$(".download-button").hide();
//		this.store.getSitemapData(sitemap, function (data) {
//			var blob = sitemap.getDataExportCsvBlob(data);
//			$(".download-button a").attr("href", window.URL.createObjectURL(blob));
//			$(".download-button a").attr("download", sitemap._id + ".csv");
//			$(".download-button").show();
//		}.bind(this));
//
//		return true;
//	},
//

//  selectSelector2: function(request) {
//		var deferredResponse = $.Deferred();
//
//    // smlee, 4. remove current content selector (we didn't need)
//		//this.removeCurrentContentSelector().done(function() {
//
//      // smlee, 5. create new conetent selector
//			var contentSelector = new ContentSelector({
//				//parentCSSSelector: request.parentCSSSelector,
//				allowedElements: "*"//request.allowedElements
//			});
//			window.cs = contentSelector;
//
//			var deferredCSSSelector = contentSelector.getCSSSelector();
//			deferredCSSSelector.done(function(response) {
//				this.removeCurrentContentSelector().done(function(){
//					deferredResponse.resolve(response);
//					window.cs = undefined;
//				}.bind(this));
//			}.bind(this)).fail(function(message) {
//				deferredResponse.reject(message);
//				window.cs = undefined;
//			}.bind(this));
//
//		//}.bind(this));
//
//		return deferredResponse.promise();
//	},


	otips: function () {
		var deferredOtips = this.contentScript.showOperationTips({
			allowedElements: "*"
		});
		deferredOtips.done(function(result) {
          console.log(result)
		}.bind(this));
	},

	unbind_otips: function () {
		var deferredOtips = this.contentScript.unshowOperationTips({
			allowedElements: "*"
		});
		deferredOtips.done(function(result) {
          console.log(result)
		}.bind(this));
	},


	get_document_by_values: function () {
		var deferredResponse = $.Deferred();
		var deferred_get_document = this.contentScript.getDocument({
			allowedElements: "*"
		});
        //document in this context is html of extenstion 

		deferred_get_document.done(function(result) {
		  chrome.runtime.sendMessage({type:'html_values', html:result}, function (response) {
		  	console.log(response)
		  }.bind(this));
		}.bind(this));
	},


	get_document_by_lists: function () {
		var deferredResponse = $.Deferred();
		var deferred_get_document = this.contentScript.getDocument({
			allowedElements: "*"
		});
        //document in this context is html of extenstion 

		deferred_get_document.done(function(result) {
		  chrome.runtime.sendMessage({type:'html_lists', html:result}, function (response) {
		  	console.log(response)
		  }.bind(this));
		}.bind(this));
	},





	get_document_by_dictionaries: function () {
		var deferredResponse = $.Deferred();
		var deferred_get_document = this.contentScript.getDocument({
			allowedElements: "*"
		});
        //document in this context is html of extenstion 

		deferred_get_document.done(function(result) {
		  chrome.runtime.sendMessage({type:'html_dictionaries', html:result}, function (response) {
		  	console.log(response)
		  }.bind(this));
		}.bind(this));
	},


	get_document_by_option_list: function () {
		var deferredResponse = $.Deferred();
		var deferred_get_document = this.contentScript.getDocument({
			allowedElements: "*"
		});
        //document in this context is html of extenstion 

		deferred_get_document.done(function(result) {
		  chrome.runtime.sendMessage({type:'html_list_option', html:result}, function (response) {
		  	console.log(response)
		  }.bind(this));
		}.bind(this));
	},



	get_document_by_option_matrix: function () {
		var deferredResponse = $.Deferred();
		var deferred_get_document = this.contentScript.getDocument({
			allowedElements: "*"
		});
        //document in this context is html of extenstion 

		deferred_get_document.done(function(result) {
		  chrome.runtime.sendMessage({type:'html_matrix_option', html:result}, function (response) {
		  	console.log(response)
		  }.bind(this));
		}.bind(this));
	},



	selectSelector: function () {
		var deferredSelector = this.contentScript.selectSelector({
			allowedElements: "*"
		});
    //console.log(selector.getItemCSSSelector())
		deferredSelector.done(function(result) {
      console.log(result)
		}.bind(this));
	},

	selectSelectorURL: function () {

		var deferredSelector = this.contentScript.selectSelectorURL({
			allowedElements: "*"
		});
		deferredSelector.done(function(result) {
      console.log(result)
		}.bind(this));
	},
//
//	getCurrentStateParentSelectorIds: function() {
//
//		var parentSelectorIds = this.state.editSitemapBreadcumbsSelectors.map(function(selector) {
//			return selector.id;
//		});
//
//		return parentSelectorIds;
//	},
//
//	selectTableHeaderRowSelector: function(button) {
//
//		var input = $(button).closest(".form-group").find("input.selector-value");
//		var sitemap = this.getCurrentlyEditedSelectorSitemap();
//		var selector = this.getCurrentlyEditedSelector();
//		var currentStateParentSelectorIds = this.getCurrentStateParentSelectorIds();
//		var parentCSSSelector = sitemap.selectors.getCSSSelectorWithinOnePage(selector.id, currentStateParentSelectorIds);
//
//		var deferredSelector = this.contentScript.selectSelector({
//			parentCSSSelector: parentCSSSelector,
//			allowedElements: "tr"
//		});
//
//		deferredSelector.done(function(result) {
//
//			var tableHeaderRowSelector = result.CSSSelector
//			$(input).val(tableHeaderRowSelector);
//
//			this.getSelectorHTML().done(function(html) {
//
//				var headerColumns = SelectorTable.getTableHeaderColumnsFromHTML(tableHeaderRowSelector, html);
//				this.renderTableHeaderColumns(headerColumns);
//
//			}.bind(this));
//
//			// update validation for selector field
//			var validator = this.getFormValidator();
//			validator.revalidateField(input);
//
//		}.bind(this));
//	},
//
//	selectTableDataRowSelector: function(button) {
//
//		var input = $(button).closest(".form-group").find("input.selector-value");
//		var sitemap = this.getCurrentlyEditedSelectorSitemap();
//		var selector = this.getCurrentlyEditedSelector();
//		var currentStateParentSelectorIds = this.getCurrentStateParentSelectorIds();
//		var parentCSSSelector = sitemap.selectors.getCSSSelectorWithinOnePage(selector.id, currentStateParentSelectorIds);
//
//		var deferredSelector = this.contentScript.selectSelector({
//			parentCSSSelector: parentCSSSelector,
//			allowedElements: "tr"
//		});
//
//		deferredSelector.done(function(result) {
//
//			$(input).val(result.CSSSelector);
//
//			// update validation for selector field
//			var validator = this.getFormValidator();
//			validator.revalidateField(input);
//
//		}.bind(this));
//	},
//
//	/**
//	 * update table selector column editing fields
//	 */
//	renderTableHeaderColumns: function(headerColumns) {
//
//		// reset previous columns
//		var $tbody = $(".feature-columns table tbody");
//		$tbody.html("");
//		headerColumns.forEach(function(column) {
//			var $row = ich.SelectorEditTableColumn(column);
//			$tbody.append($row);
//		});
//	},
//
//	/**
//	 * Returns HTML that the current selector would select
//	 */
//	getSelectorHTML: function() {
//
//		var sitemap = this.getCurrentlyEditedSelectorSitemap();
//		var selector = this.getCurrentlyEditedSelector();
//		var currentStateParentSelectorIds = this.getCurrentStateParentSelectorIds();
//		var CSSSelector = sitemap.selectors.getCSSSelectorWithinOnePage(selector.id, currentStateParentSelectorIds);
//		var deferredHTML = this.contentScript.getHTML({CSSSelector: CSSSelector});
//
//		return deferredHTML;
//	},
//	previewSelector: function (button) {
//
//		if (!$(button).hasClass('preview')) {
//
//			var sitemap = this.getCurrentlyEditedSelectorSitemap();
//			var selector = this.getCurrentlyEditedSelector();
//			var currentStateParentSelectorIds = this.getCurrentStateParentSelectorIds();
//			var parentCSSSelector = sitemap.selectors.getParentCSSSelectorWithinOnePage(currentStateParentSelectorIds);
//			var deferredSelectorPreview = this.contentScript.previewSelector({
//				parentCSSSelector: parentCSSSelector,
//				elementCSSSelector: selector.selector
//			});
//
//			deferredSelectorPreview.done(function() {
//				$(button).addClass("preview");
//			});
//		}
//		else {
//
//			this.contentScript.removeCurrentContentSelector();
//			$(button).removeClass("preview");
//		}
//	},
//	previewClickElementSelector: function(button) {
//
//		if (!$(button).hasClass('preview')) {
//
//			var sitemap = this.state.currentSitemap;
//			var selector = this.getCurrentlyEditedSelector();
//			var currentStateParentSelectorIds = this.getCurrentStateParentSelectorIds();
//			var parentCSSSelector = sitemap.selectors.getParentCSSSelectorWithinOnePage(currentStateParentSelectorIds);
//
//			var deferredSelectorPreview = this.contentScript.previewSelector({
//				parentCSSSelector: parentCSSSelector,
//				elementCSSSelector: selector.clickElementSelector
//			});
//
//			deferredSelectorPreview.done(function() {
//				$(button).addClass("preview");
//			});
//		}
//		else {
//			this.contentScript.removeCurrentContentSelector();
//			$(button).removeClass("preview");
//		}
//	},
//	previewTableRowSelector: function(button) {
//
//		if (!$(button).hasClass('preview')) {
//
//			var sitemap = this.getCurrentlyEditedSelectorSitemap();
//			var selector = this.getCurrentlyEditedSelector();
//			var currentStateParentSelectorIds = this.getCurrentStateParentSelectorIds();
//			var parentCSSSelector = sitemap.selectors.getCSSSelectorWithinOnePage(selector.id, currentStateParentSelectorIds);
//			var rowSelector = $(button).closest(".form-group").find("input").val();
//
//			var deferredSelectorPreview = this.contentScript.previewSelector({
//				parentCSSSelector: parentCSSSelector,
//				elementCSSSelector: rowSelector
//			});
//
//			deferredSelectorPreview.done(function() {
//				$(button).addClass("preview");
//			});
//		}
//		else {
//			this.contentScript.removeCurrentContentSelector();
//			$(button).removeClass("preview");
//		}
//	},
//	previewSelectorFromSelectorTree: function (button) {
//
//		if (!$(button).hasClass('preview')) {
//
//			var sitemap = this.state.currentSitemap;
//			var selector = $(button).closest("tr").data('selector');
//			var currentStateParentSelectorIds = this.getCurrentStateParentSelectorIds();
//			var parentCSSSelector = sitemap.selectors.getParentCSSSelectorWithinOnePage(currentStateParentSelectorIds);
//			var deferredSelectorPreview = this.contentScript.previewSelector({
//				parentCSSSelector: parentCSSSelector,
//				elementCSSSelector: selector.selector
//			});
//
//			deferredSelectorPreview.done(function() {
//				$(button).addClass("preview");
//			});
//		}
//		else {
//
//			this.contentScript.removeCurrentContentSelector();
//			$(button).removeClass("preview");
//		}
//	},
//	previewSelectorDataFromSelectorTree: function (button) {
//		var sitemap = this.state.currentSitemap;
//		var selector = $(button).closest("tr").data('selector');
//		this.previewSelectorData(sitemap, selector.id);
//	},
//	previewSelectorDataFromSelectorEditing: function() {
//		var sitemap = this.state.currentSitemap.clone();
//		var selector = sitemap.getSelectorById(this.state.currentSelector.id);
//		var newSelector = this.getCurrentlyEditedSelector();
//		sitemap.updateSelector(selector, newSelector);
//		this.previewSelectorData(sitemap, newSelector.id);
//	},
//	/**
//	 * Returns a list of selector ids that the user has opened
//	 * @returns {Array}
//	 */
//	getStateParentSelectorIds: function(){
//		var parentSelectorIds = [];
//		this.state.editSitemapBreadcumbsSelectors.forEach(function(selector){
//			parentSelectorIds.push(selector.id);
//		});
//		return parentSelectorIds;
//	},
//	previewSelectorData: function (sitemap, selectorId) {
//
//		// data preview will be base on how the selector tree is opened
//		var parentSelectorIds = this.getStateParentSelectorIds();
//
//		var request = {
//			previewSelectorData: true,
//			sitemap: JSON.parse(JSON.stringify(sitemap)),
//			parentSelectorIds: parentSelectorIds,
//			selectorId: selectorId
//		};
//		chrome.runtime.sendMessage(request, function (response) {
//
//			if (response.length === 0) {
//				return
//			}
//			var dataColumns = Object.keys(response[0]);
//
//			console.log(dataColumns);
//
//			var $dataPreviewPanel = ich.DataPreview({
//				columns: dataColumns
//			});
//			$("#viewport").append($dataPreviewPanel);
//			$dataPreviewPanel.modal('show');
//			// display data
//			// Doing this the long way so there aren't xss vulnerubilites
//			// while working with data or with the selector titles
//			var $tbody = $("tbody", $dataPreviewPanel);
//			response.forEach(function (row) {
//				var $tr = $("<tr></tr>");
//				dataColumns.forEach(function (column) {
//					var $td = $("<td></td>");
//					var cellData = row[column];
//					if (typeof cellData === 'object') {
//						cellData = JSON.stringify(cellData);
//					}
//					$td.text(cellData);
//					$tr.append($td);
//				});
//				$tbody.append($tr);
//			});
//
//			var windowHeight = $(window).height();
//
//			$(".data-preview-modal .modal-body").height(windowHeight - 130);
//
//			// remove modal from dom after it is closed
//			$dataPreviewPanel.on("hidden.bs.modal", function () {
//				$(this).remove();
//			});
//		});
//	},
//	/**
//	 * Add start url to sitemap creation or editing form
//	 * @param button
//	 */
//	addStartUrl: function(button) {
//
//		var $startUrlInputField = ich.SitemapStartUrlField();
//		$("#viewport .start-url-block:last").after($startUrlInputField);
//		var validator = this.getFormValidator();
//		validator.addField($startUrlInputField.find("input"));
//	},
//	/**
//	 * Remove start url from sitemap creation or editing form.
//	 * @param button
//	 */
//	removeStartUrl: function(button) {
//
//		var $block = $(button).closest(".start-url-block");
//		if($("#viewport .start-url-block").length > 1) {
//
//			// remove from validator
//			var validator = this.getFormValidator();
//			validator.removeField($block.find("input"));
//			
//			$block.remove();
//		}
//	}
};
