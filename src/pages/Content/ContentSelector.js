/**
 * @param options.parentCSSSelector	Elements can be only selected within this element
 * @param options.allowedElements	Elements that can only be selected
 * @constructor
 */
ContentSelector = function(options) {

	// deferred response
	this.deferredCSSSelectorResponse = $.Deferred();

	this.allowedElements = options.allowedElements;
	//this.parentCSSSelector = options.parentCSSSelector.trim();
	//this.alert = options.alert || function(txt) {alert(txt);};

	//if(this.parentCSSSelector) {
	//	this.parent = $(this.parentCSSSelector)[0];

	//	//  handle situation when parent selector not found
	//	if(this.parent === undefined) {
	//		this.deferredCSSSelectorResponse.reject("parent selector not found");
	//		this.alert("Parent element not found!");
	//		return;
	//	}
	//}
	//else {
		this.parent = $("body")[0];
	//}
};

ContentSelector.prototype = {
  tempXpath: "",
  containsFlag: !1,
  indexes: [],
  matchIndex: [],
	/**
	 * get css selector selected by the user
	 */
	getCSSSelector: function(request) {

		if(this.deferredCSSSelectorResponse.state() !== "rejected") {

			this.selectedElements;
      this.resultXpath;
			this.top = 0;
			this.initGUI();
		}

		return this.deferredCSSSelectorResponse.promise();
	},

	getCSSSelectorURL: function(request) {

		if(this.deferredCSSSelectorResponse.state() !== "rejected") {

			this.selectedElements = [];
      this.resultXpath;
			this.top = 0;
			this.initGUIURL();
		}

		return this.deferredCSSSelectorResponse.promise();
	},

	getCurrentCSSSelector: function() {

		if(this.selectedElements && this.selectedElements.length > 0) {

			var cssSelector;

			// handle special case when parent is selected
			if(this.isParentSelected()) {
				if(this.selectedElements.length === 1) {
					cssSelector = '_parent_';
				}
				else if($("#-selector-toolbar [name=diferentElementSelection]").prop("checked")) {
					var selectedElements = this.selectedElements.clone();
					selectedElements.splice(selectedElements.indexOf(this.parent),1);
					cssSelector = '_parent_, '+this.cssSelector.getCssSelector(selectedElements, this.top);
				}
				else {
					// will trigger error where multiple selections are not allowed
					cssSelector = this.cssSelector.getCssSelector(this.selectedElements, this.top);
				}
			}
			else {
				cssSelector = this.cssSelector.getCssSelector(this.selectedElements, this.top);
			}

			return cssSelector;
		}
		return "";
	},

	isParentSelected: function() {
		return this.selectedElements.indexOf(this.parent) !== -1;
	},

	/**
	 * initialize or reconfigure css selector class
	 * @param allowMultipleSelectors
	 */
	initCssSelector: function(allowMultipleSelectors) {
		this.cssSelector = new CssSelector({
			enableSmartTableSelector: true,
			parent: this.parent,
			allowMultipleSelectors:allowMultipleSelectors,
			ignoredClasses: [
				"-sitemap-select-item-selected",
				"-sitemap-select-item-hover",
				"-sitemap-parent",
				"-web-scraper-img-on-top",
				"-web-scraper-selection-active"
			],
			query: jQuery
		});
	},

	previewSelector: function (elementCSSSelector) {

		if(this.deferredCSSSelectorResponse.state() !== "rejected") {

			this.highlightParent();
			$(ElementQuery(elementCSSSelector, this.parent)).addClass('-sitemap-select-item-selected');
			this.deferredCSSSelectorResponse.resolve();
		}

		return this.deferredCSSSelectorResponse.promise();
	},


	initGUIURL: function () {

		this.$allElements = $(this.allowedElements+":not(#-selector-toolbar):not(#-selector-toolbar *)", this.parent);

		if(this.parent !== document.body) {
			this.$allElements.push(this.parent);
		}

		this.unbindElementSelection();
		this.unbindElementHighlight();
		this.removeToolbar();


		this.bindElementHighlight();
		this.bindElementHighlightURL();
		this.bindElementSelectionURL();
	
		this.attachToolbarURL();
	},



	initGUI: function () {

		//this.highlightParent();

		// all elements except toolbar
		this.$allElements = $(this.allowedElements+":not(#-selector-toolbar):not(#-selector-toolbar *)", this.parent);
		// allow selecting parent also
		if(this.parent !== document.body) {
			this.$allElements.push(this.parent);
		}

		this.unbindElementSelection();
		this.unbindElementHighlight();
		this.removeToolbar();

    this.bindElementOperationTips()
	  this.attachOperationTips()

    //tmp 
		//this.bindElementHighlight();
		//this.bindElementSelection();
		//this.attachToolbar();


		//this.bindKeyboardSelectionManipulations();
		//this.bindMultipleGroupCheckbox();
		//this.bindMultipleGroupPopupHide();
		//this.bindMoveImagesToTop();
	},

  getListXpath: function(x1, x2){

     let output1 = x1.split('//')
     let output2 = x2.split('//')

     let output1_len = output1.length
     let output_idx

     for(let idx in output1){
       if(output1[output1_len - idx] != output2[output1_len - idx]){
         output = output1[output1_len - idx]
         output = output.split('[')[0]
         output_idx = output1_len - idx
       }
     }

     let fin = ''
     for(let idx in output1){
       if(idx == 0){
         continue;
       }
       if(idx == output_idx){
         fin = fin + '//' + output
       }
       else{
         fin = fin + '//' + output1[idx]
       }
     }
     return fin
  },

	bindElementSelectionURL: function () {

    if(this.selectedElements.length >=2){
      this.selectedElements = []
		  $(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
    }
		this.$allElements.bind("click.elementSelector", function (e) {
			var element = e.currentTarget;
      //let elementsOfXPath = document.evaluate(optListXpath,document);
      this.selectedElements.push(element)
      let num_selected = this.selectedElements.length
      console.log(this.selectedElements)
      console.log(num_selected)
      if(num_selected >= 2){
        let elem1 = this.selectedElements[num_selected - 1]
        let elem2 = this.selectedElements[num_selected - 2]
			  $(elem1).removeClass("-sitemap-select-item-hover");
			  $(elem1).removeClass('-sitemap-select-item-selected');
			  $(elem2).removeClass("-sitemap-select-item-hover");
			  $(elem2).removeClass('-sitemap-select-item-selected');
        var optRelXpath1 = this.generateRelXpath(elem1);
        console.log("optRelXPath = ", optRelXpath1)
        var absXpath1 = this.generateAbsXpath(elem1);
        console.log("absXPath = ", absXpath1)
        var listXpath1 = this.generateListXpath(absXpath1)
        console.log("listXPath = ", listXpath1)

        var optRelXpath2 = this.generateRelXpath(elem2);
        console.log("optRelXPath = ", optRelXpath2)
        var absXpath2 = this.generateAbsXpath(elem2);
        console.log("absXPath = ", absXpath2)
        var listXpath2 = this.generateListXpath(absXpath2)
        console.log("listXPath = ", listXpath2)

        this.resultXpath = optRelXpath1;


        let suffixListXpath = this.getListXpath(listXpath1, listXpath2)
        console.log(suffixListXpath)
        let x1 = absXpath1
        let x2 = absXpath2

        let output1 = x1.split('/')
        let output2 = x2.split('/')

        let output1_len = output1.length
        let output_idx

        for(let idx in output1){
          if(output1[idx] != output2[idx]){
            output_idx = idx
            break;
          }
        }

        let fin = ''
        for(let idx in output1){
          if(idx == 0){
            continue;
          }
          if(parseInt(idx) < parseInt(output_idx)){
            fin = fin + '/' + output1[idx]
          }
          else{
            break;
            //fin = fin + '/' + output1[idx]
          }
        }
        let finalXpath = fin + suffixListXpath



        let res = document.evaluate(finalXpath, document);
        let tmpElements = [];
        let node
        while(node = res.iterateNext()) {
          tmpElements.push(node)
        }
        let limit_num = tmpElements.length

        let idx1 = finalXpath.lastIndexOf('//')
        let idx2 = finalXpath.lastIndexOf('[')
        let last_tag = finalXpath.slice(idx1+2, idx2)
        if(last_tag == 'a'){
          console.log(finalXpath)
			    this.highlightSelectedElementsURL(finalXpath);
			    return false;
        }
        else{
          let candidate1 = finalXpath.slice(0, idx1+2) + 'a'

          console.log(candidate1)
          let res1 = document.evaluate(candidate1, document);
          let tmpElements1 = [];
          let node1
          while(node1 = res1.iterateNext()) {
            tmpElements1.push(node)
          }
          let candidate_limit_num = tmpElements1.length
          console.log(candidate_limit_num, limit_num)
          if(parseInt(candidate_limit_num) <= parseInt(limit_num) && parseInt(candidate_limit_num) != 0 ){
            finalXpath = candidate1
            console.log(finalXpath)
			      this.highlightSelectedElementsURL(finalXpath);
			      return false;
          }
          else{
            let candidate2 = finalXpath + '//a'
            console.log(candidate2)

            let res2 = document.evaluate(candidate2, document);
            let tmpElements2 = [];
            let node2
            while(node2 = res2.iterateNext()) {
              tmpElements2.push(node)
            }
            let candidate_limit_num2 = tmpElements2.length
            console.log(candidate_limit_num2)
            if(parseInt(candidate_limit_num2) <= parseInt(limit_num) && parseInt(candidate_limit_num2) != 0 ){
              finalXpath = candidate2
              console.log(finalXpath)
			        this.highlightSelectedElementsURL(finalXpath);
			        return false;
            }
          }

			    this.highlightSelectedElementsURL(finalXpath);
			    return false;
        }
      }


			// Cancel all other events
			return false;
		}.bind(this));
	},




	bindElementOperationTips: function () {

		this.$allElements.bind("click.elementSelector", function (e) {

			// Cancel all other events
			return false;
		}.bind(this));
	},




	bindElementSelection: function () {

		this.$allElements.bind("click.elementSelector", function (e) {
			var element = e.currentTarget;
			$(element).removeClass("-sitemap-select-item-hover");
			//$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
			$(element).removeClass('-sitemap-select-item-selected');
      console.log(element)
      var optRelXpath = this.generateRelXpath(element);
      console.log("optRelXPath = ")
      console.log(optRelXpath)
      var absXpath = this.generateAbsXpath(element);
      console.log("absXPath = ")
      console.log(absXpath)
      var listXpath = this.generateListXpath(absXpath)
      console.log("listXPath = ")
      console.log(listXpath)
      let optListXpath
      if(element.id != ''){
        optListXpath = listXpath.slice(0,-2) + "@id='" + element.id + "']"
        console.log(optListXpath)
      }
      else if(element.className != ''){
        optListXpath = listXpath.slice(0,-2) + "@class='" + element.className + "']"
        console.log(optListXpath)
      }
      else{
        optListXpath = listXpath;
        console.log(optListXpath)
      }
      this.resultXpath = optRelXpath;
      //for highlight list
      //let elementsOfXPath = document.evaluate(optListXpath,document);
      //let selectedListElements = [];
      //let node
      //while(node = elementsOfXPath .iterateNext()) {
      //  selectedListElements.push(node)
      //}
      ////console.log(selectedListElements)
      //for (let i = 0; i < selectedListElements.length; i++) {
      //  $(selectedListElements[i]).addClass('-sitemap-select-item-selected');
      //}

			this.selectedElements = element;
			this.highlightSelectedElements(optRelXpath);

			// Cancel all other events
			return false;
		}.bind(this));
	},

  generateListXpath: function(xpath){
    let xpathDiv = xpath.split("/");
    let leng = xpathDiv.length;
    let topADEdgeIndex = 1;
    let prevTopADEdgeIndex = 0;
    let xpathPrefix = "//";
    let i = 0;
    let lastCandidate = ""
    while(topADEdgeIndex <= leng -1){
      let candidate = ""
      for (i = leng -1 ; i > topADEdgeIndex; i--){
        let res;
        if(xpathPrefix != '//'){
          candidate = xpathDiv[i] + candidate;
          res = document.evaluate(xpathPrefix +'//'+ candidate, document);//Can't find elements in iframe 
        }
        else{
          candidate = xpathDiv[i] +candidate;
          res = document.evaluate(xpathPrefix + candidate, document);//Can't find elements in iframe 
        }
        let cnt = 0;
        let elem;
        while(elem = res.iterateNext()) {
          cnt++;
        }
        if(cnt == 1){
          topADEdgeIndex = i;
          if(xpathPrefix == '//'){
            xpathPrefix = xpathPrefix + xpathDiv[i]; 
          }
          else{
            xpathPrefix = xpathPrefix +'//'+ xpathDiv[i]; 
          }
          break;
        }
        else{
          candidate = '/' + candidate
        }
      }
      if(topADEdgeIndex == i){
        if(prevTopADEdgeIndex == topADEdgeIndex){
          xpathPrefix = '/' + candidate
          prevTopADEdgeIndex = topADEdgeIndex
          return xpathPrefix;
          break;
        }
        else{
          prevTopADEdgeIndex = topADEdgeIndex
          //console.log(topADEdgeIndex)
        }
      }
      if(i == leng -1 ){
        break;
      }
    }
    //console.log('end')
    //console.log(xpathPrefix);
    //console.log(xpathPrefix + '//' + lastCandidate) 
    return xpathPrefix; 
  },


  optimizeXpath: function(_document, xpath) {
    let xpathDiv = xpath.split("//");
    let leng = xpathDiv.length;
    var regBarces = /[^[\]]+(?=])/g;
    let bracesContentArr = xpath.match(regBarces);
    let startOptimizingFromHere = 1;
    for (let j = bracesContentArr.length - 1; j > 0; j--) {
        startOptimizingFromHere++;
        if (bracesContentArr[j].length > 3) {
            startOptimizingFromHere = startOptimizingFromHere;
            break
        }
    }
    let tempXpath = xpath.split("//" + xpathDiv[leng - startOptimizingFromHere])[1];
    let totalMatch = 0;
    try {
        totalMatch = _document.evaluate(tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength
    } catch (err) {
        return xpath
    }
    if (totalMatch === 1) {
        return tempXpath
    }
    for (let i = leng - startOptimizingFromHere; i > 0; i--) {
        let temp = xpath.replace("//" + xpathDiv[i], "");
        try {
            totalMatch = _document.evaluate(temp, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 1) {
                xpath = temp
            }
        } catch (err) {
            return xpath
        }
    }
    return xpath
  },

  generateAbsXpath: function(element) {
    if (element.tagName.toLowerCase().includes("style") || element.tagName.toLowerCase().includes("script")) {
        return "This is " + element.tagName.toLowerCase() + " tag. For " + element.tagName.toLowerCase() + " tag, no need to write selector. :P"
    }
    if (element.tagName.toLowerCase() === 'html')
        return '/html[1]';
    if (element.tagName.toLowerCase() === 'body')
        return '/html[1]/body[1]';
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            if (element.tagName.toLowerCase().includes('svg')) {
                var absXpath = this.generateAbsXpath(element.parentNode) + '/' + '*';
                return absXpath
            } else {
                var absXpath = this.generateAbsXpath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
                if (absXpath.includes("/*/")) {
                    absXpath = "It might be child of iframe & it is not supported currently."
                }
                return absXpath
            }
        }
        if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === element.tagName.toLowerCase()) {
            ix++
        }
    }
  },


  generateRelXpath: function(element) {
    _document = element.ownerDocument;
    relXpath = this.formRelXpath(_document, element);
    //console.log(relXpath)
    let doubleForwardSlash = /\/\/+/g;
    let numOfDoubleForwardSlash = 0;
    try {
        numOfDoubleForwardSlash = relXpath.match(doubleForwardSlash).length
    } catch (err) {}
    if (numOfDoubleForwardSlash > 1 && relXpath.includes('[') && !relXpath.includes('@href') && !relXpath.includes('@src')) {
        relXpath = this.optimizeXpath(_document, relXpath)
    }
    if (relXpath === undefined) {
        relXpath = "It might be child of svg/pseudo/comment/iframe from different src. XPath doesn't support for them."
    }
    this.tempXpath = "";
    //console.log("Optimized Relative XPath")
    //console.log(relXpath)
    return relXpath
  },
  
  removeLineBreak: function(value) {
    if (value) {
        value = value.split('\n')[0].length > 0 ? value.split('\n')[0] : value.split('\n')[1]
    }
    return value
  },

  formRelXpath: function(_document, element) {
    var userAttr = "";//userAttrName.value.trim();
    var idChecked = "withid";//idCheckbox.checked ? "withid" : "withoutid";
    var classChecked = "withclass";//classAttr.checked ? "withclass" : "withoutclass";
    var nameChecked = "withname";//nameAttr.checked ? "withname" : "withoutname";
    var placeholderChecked = "withplaceholder";//placeholderAttr.checked ? "withplaceholder" : "withoutplaceholder";
    var textChecked = "withouttext";//placeholderAttr.checked ? "withplaceholder" : "withoutplaceholder";
    var attributeChoicesForXpath = [userAttr, idChecked, classChecked, nameChecked, placeholderChecked, textChecked]
    //attributeChoicesForXpath = attributeChoices.split(",");
    var userAttr = attributeChoicesForXpath[0];
    //var userAttr = attributeChoices[0];

    var innerText = [].reduce.call(element.childNodes, function(a, b) {
        return a + (b.nodeType === 3 ? b.textContent : '')
        //return a + ''
    }, '').trim().slice(0, 50);
    innerText = this.removeLineBreak(innerText);

   
    var tagName = element.tagName.toLowerCase();
    if (tagName.includes("style") || tagName.includes("script")) {
        return "This is " + tagName + " tag. For " + tagName + " tag, no need to write selector. :P"
    }
    if (tagName.includes('svg')) {
        tagName = "*"
    }

    if (innerText.includes("'")) {
        innerText = innerText.split('  ')[innerText.split('  ').length - 1];
        containsText = '[contains(text(),"' + innerText + '")]';
        equalsText = '[text()="' + innerText + '"]'
    } else {
        innerText = innerText.split('  ')[innerText.split('  ').length - 1];
        containsText = "[contains(text(),'" + innerText + "')]";
        equalsText = "[text()='" + innerText + "']"
    }
    if (tagName.includes('html')) {
        return '//html' + this.tempXpath
    }
    var attr = "";
    var attrValue = "";
    var listOfAttr = {};
    if ((!element.getAttribute(userAttr) || userAttr.toLowerCase() === "id") && element.id !== '' && attributeChoicesForXpath.includes("withid")) {
        var id = element.id;
        id = this.removeLineBreak(id);
        this.tempXpath = '//' + tagName + "[@id='" + id + "']" + this.tempXpath;
        var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
        if (totalMatch === 1) {
            return this.tempXpath
        } else {
            if (innerText && element.getElementsByTagName('*').length === 0) {
                var containsXpath = '//' + tagName + containsText;
                var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 0) {
                    var equalsXpath = '//' + tagName + equalsText;
                    var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 1) {
                        return equalsXpath
                    } else {
                        this.tempXpath = this.tempXpath
                    }
                } else if (totalMatch === 1) {
                    return containsXpath
                } else {
                    this.tempXpath = this.tempXpath
                }
            } else {
              this.tempXpath = this.tempXpath
            }
        }
    } else if (element.attributes.length != 0) {
        if (!attrValue) {
            for (var i = 0; i < element.attributes.length; i++) {
                attr = element.attributes[i].name;
                attrValue = element.attributes[i].nodeValue;
                if (attrValue != null && attrValue != "" && (attr !== "style" || userAttr === "style") && attr !== "id" && attr !== "xpath" && (attributeChoicesForXpath.includes("with" + attr) || userAttr == attr)) {
                    listOfAttr[attr] = attrValue
                }
            }
        }

        if (userAttr in listOfAttr) {
            attr = userAttr;
            attrValue = listOfAttr[attr]
        } else if ("placeholder" in listOfAttr) {
            attr = "placeholder";
            attrValue = listOfAttr[attr]
        } else if ("title" in listOfAttr) {
            attr = "title";
            attrValue = listOfAttr[attr]
        } else if ("value" in listOfAttr) {
            attr = "value";
            attrValue = listOfAttr[attr]
        } else if ("name" in listOfAttr) {
            attr = "name";
            attrValue = listOfAttr[attr]
        } else if ("type" in listOfAttr) {
            attr = "type";
            attrValue = listOfAttr[attr]
        } else if ("class" in listOfAttr) {
            attr = "class";
            attrValue = listOfAttr[attr]
        } else {
            attr = Object.keys(listOfAttr)[0];
            attrValue = listOfAttr[attr]
        }
        attrValue = this.removeLineBreak(attrValue);
        if (attrValue != null && attrValue != "" && attr !== "xpath") {
            var xpathWithoutAttribute = '//' + tagName + this.tempXpath;
            var xpathWithAttribute = "";
            if (attrValue.includes('  ')) {
                attrValue = attrValue.split('  ')[attrValue.split('  ').length - 1];
                this.containsFlag = !0
            }
            if (attrValue.includes("'")) {
                if (attrValue.charAt(0) === " " || attrValue.charAt(attrValue.length - 1) === " " || this.containsFlag) {
                    xpathWithAttribute = '//' + tagName + '[contains(@' + attr + ',"' + attrValue.trim() + '")]' + this.tempXpath
                } else {
                  xpathWithAttribute = '//' + tagName + '[@' + attr + '="' + attrValue + '"]' + this.tempXpath
                }
            } else {
                if (attrValue.charAt(0) === " " || attrValue.charAt(attrValue.length - 1) === " " || this.containsFlag) {
                    xpathWithAttribute = '//' + tagName + "[contains(@" + attr + ",'" + attrValue.trim() + "')]" + this.tempXpath
                } else {
                  xpathWithAttribute = '//' + tagName + "[@" + attr + "='" + attrValue + "']" + this.tempXpath
                }
            }
            var totalMatch = _document.evaluate(xpathWithAttribute, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 1) {
                if ((xpathWithAttribute.includes('@href') && !userAttr.includes("href")) || (xpathWithAttribute.includes('@src') && !userAttr.includes("src")) && innerText) {
                    var containsXpath = '//' + tagName + containsText;
                    var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 0) {
                        var equalsXpath = '//' + tagName + equalsText;
                        var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                        if (totalMatch === 1) {
                            return equalsXpath
                        }
                    } else if (totalMatch === 1) {
                        return containsXpath
                    }
                }
                return xpathWithAttribute
            } 
            else if (innerText) {
                var containsXpath = '//' + tagName + containsText;
                var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 0) {
                    var equalsXpath = '//' + tagName + equalsText;
                    var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 1) {
                        return equalsXpath
                    } else {
                        this.tempXpath = equalsXpath
                    }
                } else if (totalMatch === 1) {
                    return containsXpath
                } else {
                    containsXpath = xpathWithAttribute + containsText;
                    totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 0) {
                        var equalsXpath = xpathWithAttribute + equalsText;
                        var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                        if (totalMatch === 1) {
                            return equalsXpath
                        }
                    } else if (totalMatch === 1) {
                        return containsXpath
                    } else if (attrValue.includes('/') || innerText.includes('/')) {
                        if (attrValue.includes('/')) {
                            containsXpath = xpathWithoutAttribute + containsText
                        }
                        if (innerText.includes('/')) {
                            containsXpath = containsXpath.replace(containsText, "")
                        }
                        this.tempXpath = containsXpath
                    } else {
                        this.tempXpath = containsXpath
                    }
                }
            } else {
                this.tempXpath = xpathWithAttribute;
                if (attrValue.includes('/')) {
                    this.tempXpath = "//" + tagName + xpathWithoutAttribute
                }
            }
        } 
        else if (innerText) {
            var containsXpath = '//' + tagName + containsText;
            var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 0) {
                var equalsXpath = '//' + tagName + equalsText;
                var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 1) {
                    return equalsXpath
                }
            } else if (totalMatch === 1) {
                return containsXpath
            }
            this.tempXpath = containsXpath
        } 
        else if ((attrValue == null || attrValue == "" || attr.includes("xpath"))) {
            this.tempXpath = "//" + tagName + this.tempXpath
        }
    } 
    else if (attrValue == "" && innerText && !tagName.includes("script")) {
        var containsXpath = '//' + tagName + containsText + this.tempXpath;
        var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
        if (totalMatch === 0) {
            this.tempXpath = '//' + tagName + equalsText + this.tempXpath;
            var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 1) {
                return this.tempXpath
            }
        } else if (totalMatch === 1) {
            return containsXpath
        } else {
            this.tempXpath = containsXpath
        }
    } 
    else {
        this.tempXpath = "//" + tagName + this.tempXpath
    }
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            this.indexes.push(ix + 1);
            if(this.tempXpath == undefined){
              this.tempXpath = ""
            }
            this.tempXpath = this.formRelXpath(_document, element.parentNode);
            if (!this.tempXpath.includes("/")) {
                return this.tempXpath
            } else {
                var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 1) {
                    return this.tempXpath
                } else {
                    this.tempXpath = "/" + this.tempXpath.replace(/\/\/+/g, '/');
                    var regSlas = /\/+/g;
                    var regBarces = /[^[\]]+(?=])/g;
                    while ((match = regSlas.exec(this.tempXpath)) != null) {
                        this.matchIndex.push(match.index)
                    }
                    for (var j = 0; j < this.indexes.length; j++) {
                        if (j === 0) {
                            var lastTag = this.tempXpath.slice(this.matchIndex[this.matchIndex.length - 1]);
                            if ((match = regBarces.exec(lastTag)) != null) {
                                lastTag = lastTag.replace(regBarces, this.indexes[j]).split("]")[0] + "]";
                                console.log(this.tempXpath)
                                this.tempXpath = this.tempXpath.slice(0, this.matchIndex[this.matchIndex.length - 1]) + lastTag
                                console.log(this.tempXpath)
                            } else {
                                console.log(this.tempXpath)
                                this.tempXpath = this.tempXpath + "[" + this.indexes[j] + "]"
                                console.log(this.tempXpath)
                            }
                        } else {
                            var lastTag = this.tempXpath.slice(this.matchIndex[this.matchIndex.length - (j + 1)], this.matchIndex[this.matchIndex.length - (j)]);
                            if ((match = regBarces.exec(lastTag)) != null) {
                                lastTag = lastTag.replace(regBarces, this.indexes[j]);
                                console.log(this.tempXpath)
                                this.tempXpath = this.tempXpath.slice(0, this.matchIndex[this.matchIndex.length - (j + 1)]) + lastTag + this.tempXpath.slice(this.matchIndex[this.matchIndex.length - j])
                                console.log(this.tempXpath)
                            } else {
                                console.log(this.tempXpath)
                                console.log(this.matchIndex[this.matchIndex.length - j])
                               
                                this.tempXpath = this.tempXpath.slice(0, this.matchIndex[this.matchIndex.length - j]) + "[" + this.indexes[j] + "]" + this.tempXpath.slice(this.matchIndex[this.matchIndex.length - j])
                              
                                console.log(this.tempXpath)
                            }
                        }
                        console.log(this.tempXpath)
                        if (this.tempXpath[0] == '['){
                          this.tempXpath = this.tempXpath.slice(3)
                        }
                        console.log(this.tempXpath)
                        var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                        if (totalMatch === 1) {
                            var regSlashContent = /([a-zA-Z])([^/]*)/g;
                            var length = this.tempXpath.match(regSlashContent).length;
                            for (var k = j + 1; k < length - 1; k++) {
                                var lastTag = this.tempXpath.match(/\/([^\/]+)\/?$/)[1];
                                var arr = this.tempXpath.match(regSlashContent);
                                arr.splice(length - k, 1, '/');
                                var relXpath = "";
                                for (var i = 0; i < arr.length - 1; i++) {
                                    if (arr[i]) {
                                        relXpath = relXpath + "/" + arr[i]
                                    } else {
                                        relXpath = relXpath + "//" + arr[i]
                                    }
                                }
                                relXpath = (relXpath + "/" + lastTag).replace(/\/\/+/g, '//');
                                relXpath = relXpath.replace(/\/\/+/g, '/');
                                relXpath = relXpath.replace(/\/+/g, "//");
                                var totalMatch = _document.evaluate(relXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                                if (totalMatch === 1) {
                                    this.tempXpath = relXpath
                                }
                            }
                            return this.tempXpath.replace('//html', '')
                        }
                    }
                }
            }
        }
        if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === element.tagName.toLowerCase()) {
            ix++
        }
    }
  },

	/**
	 * Add to select elements the element that is under the mouse
	 */
	selectMouseOverElement: function() {

		var element = this.mouseOverElement;
		if(element) {
			this.selectedElements.push(element);
			//this.highlightSelectedElements();
		}
	},

	bindElementHighlight: function () {
		$(this.$allElements).bind("mouseover.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			var element = e.currentTarget;
			this.mouseOverElement = element;
			$(element).addClass("-sitemap-select-item-hover");
		}.bind(this)).bind("mouseout.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			var element = e.currentTarget;
			this.mouseOverElement = null;
			$(element).removeClass("-sitemap-select-item-hover");
		}.bind(this));
	},


	bindElementHighlightURL: function () {
		$(this.$allElements).bind("mouseover.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}
   

			var element = e.currentTarget;
      //console.log('-----------1---------')
      //console.log($(element))
      if ($(element).hasClass('-sitemap-select-item-selected')){
        //console.log(e.currentTarget)
        absXpath = this.generateAbsXpath(element);
        console.log(absXpath)
			  $("body #-selector-toolbar #element_abs_xpath").text(absXpath);
      }
      //console.log('-----------2---------')
			//this.mouseOverElement = element;
			//$(element).addClass("-sitemap-select-item-hover");
		}.bind(this)).bind("mouseout.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			//var element = e.currentTarget;
			//this.mouseOverElement = null;
			//$(element).removeClass("-sitemap-select-item-hover");
		}.bind(this));
	},



	bindMoveImagesToTop: function() {

		$("body").addClass("-web-scraper-selection-active");

		// do this only when selecting images
		if(this.allowedElements === 'img') {
			$("img").filter(function(i, element) {
				return $(element).css("position") === 'static';
			}).addClass("-web-scraper-img-on-top");
		}
	},

	unbindMoveImagesToTop: function() {

		$("body.-web-scraper-selection-active").removeClass("-web-scraper-selection-active");
		$("img.-web-scraper-img-on-top").removeClass("-web-scraper-img-on-top");
	},

	selectChild: function () {
		this.top--;
		if (this.top < 0) {
			this.top = 0;
		}
	},
	selectParent: function () {
		this.top++;
	},

	// User with keyboard arrows can select child or paret elements of selected elements.
	bindKeyboardSelectionManipulations: function () {

		// check for focus
		var lastFocusStatus;
		this.keyPressFocusInterval = setInterval(function() {
			var focus = document.hasFocus();
			if(focus === lastFocusStatus) return;
			lastFocusStatus = focus;

			$("#-selector-toolbar .key-button").toggleClass("hide", !focus);
			$("#-selector-toolbar .key-events").toggleClass("hide", focus);
		}.bind(this), 200);


		// Using up/down arrows user can select elements from top of the
		// selected element
		$(document).bind("keydown.selectionManipulation", function (event) {

			// select child C
			if (event.keyCode === 67) {
				this.animateClickedKey($("#-selector-toolbar .key-button-child"));
				this.selectChild();
			}
			// select parent P
			else if (event.keyCode === 80) {
				this.animateClickedKey($("#-selector-toolbar .key-button-parent"));
				this.selectParent();
			}
			// select element
			else if (event.keyCode === 83) {
				this.animateClickedKey($("#-selector-toolbar .key-button-select"));
				this.selectMouseOverElement();
			}

			//this.highlightSelectedElements();
		}.bind(this));
	},

	animateClickedKey: function(element) {
		$(element).removeClass("clicked").removeClass("clicked-animation");
		setTimeout(function() {
			$(element).addClass("clicked");
			setTimeout(function(){
				$(element).addClass("clicked-animation");
			},100);
		},1);

	},


	highlightSelectedElementsURL: function (optRelXpath) {
		try {
      var res = document.evaluate(optRelXpath, document);
			$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');


      let listElements = [];
      while(node = res.iterateNext()) {
        listElements.push(node)
      }
      console.log(listElements)
      for (var i = 0; i < listElements.length; i++) {
        $(listElements[i]).addClass('-sitemap-select-item-selected');
      }

			$("body #-selector-toolbar .selector").text(optRelXpath);
			//// highlight selected elements
      //console.log(this.selectedElements)
      //console.log(this.parent)
			//$(ElementQuery(this.selectedElements, this.parent)).addClass('-sitemap-select-item-selected');
		}
		catch(err) {
			if(err === "found multiple element groups, but allowMultipleSelectors disabled") {
				console.log("multiple different element selection disabled");

				this.showMultipleGroupPopup();
				// remove last added element
				this.selectedElements.pop();
				this.highlightSelectedElements();
			}
		}
	},



	highlightSelectedElements: function (optRelXpath) {
		try {
			//var resultCssSelector = this.getCurrentCSSSelector();
      //console.log(" highlightSelectedElements");
      console.log(optRelXpath)
      var res = document.evaluate(optRelXpath, document);
      var elem = "temp";
      if(res){
        elem = res.iterateNext();
      }
      //console.log(elem)
      //console.log('-----------------------')
			$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
      $(elem).addClass('-sitemap-select-item-selected');
      //https://www.amazon.com/s?bbn=16225007011&rh=n%3A16225007011%2Cn%3A172456&dc&fst=as%3Aoff&qid=1578897380&rnid=16225007011&ref=lp_16225007011_nr_n_0
      //var elementsOfXPath = document.evaluate('//div[1]/span[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/h2[1]/a[1]/span[1]',document);

      //https://en.zalando.de/womens-clothing-dresses/
      //var elementsOfXPath = document.evaluate('//article[1]/div[1]/div[2]/header[1]/a[1]/div[1]/div[2]',document);

      //https://www.walmart.com/browse/food/coffee/976759_1086446_1229652?povid=1086446+%7C++%7C+Coffee%20Whole%20Bean%20Coffee%20Featured%20Categories%20Collapsible
      //var elementsOfXPath = document.evaluate('//div[1]/div[2]/div[5]/div[1]/a[1]/span[1]',document);
     
      //https://www.newegg.com/p/pl?N=100023490&cm_sp=Cat_Digital-Cameras_1-_-VisNav-_-Cameras_1
      //var elementsOfXPath = document.evaluate('//div/div[1]/a[@class=\'item-title\']',document);
      
      //https://global.rakuten.com/en/category/206878/?l-id=rgm-top-en-nav-shoes-mensneakers 
      //var elementsOfXPath = document.evaluate('//li/div[1]/div[2]/div[1]/a[1]',document);


      //var selectedElements = [];
      //while(node = elementsOfXPath .iterateNext()) {
      //  selectedElements.push(node)
      //}

      //for (var i = 0; i < selectedElements.length; i++) {
      //  //console.log(selectedElements[i]);
      //  $(selectedElements[i]).addClass('-sitemap-select-item-selected');
      //}

			$("body #-selector-toolbar .selector").text(optRelXpath);
			//// highlight selected elements
      //console.log(this.selectedElements)
      //console.log(this.parent)
			//$(ElementQuery(this.selectedElements, this.parent)).addClass('-sitemap-select-item-selected');
		}
		catch(err) {
			if(err === "found multiple element groups, but allowMultipleSelectors disabled") {
				console.log("multiple different element selection disabled");

				this.showMultipleGroupPopup();
				// remove last added element
				this.selectedElements.pop();
				this.highlightSelectedElements();
			}
		}
	},

	showMultipleGroupPopup: function() {
		$("#-selector-toolbar .popover").attr("style", "display:block !important;");
	},

	hideMultipleGroupPopup: function() {
		$("#-selector-toolbar .popover").attr("style", "");
	},

	bindMultipleGroupPopupHide: function() {
		$("#-selector-toolbar .popover .close").click(this.hideMultipleGroupPopup.bind(this));
	},

	unbindMultipleGroupPopupHide: function() {
		$("#-selector-toolbar .popover .close").unbind("click");
	},

	bindMultipleGroupCheckbox: function() {
		$("#-selector-toolbar [name=diferentElementSelection]").change(function(e) {
			if($(e.currentTarget).is(":checked")) {
				this.initCssSelector(true);
			}
			else {
				this.initCssSelector(false);
			}
		}.bind(this));
	},
	unbindMultipleGroupCheckbox: function(){
		$("#-selector-toolbar .diferentElementSelection").unbind("change");
	},



	attachOperationTips: function () {
		var $toolbar = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">' +
  '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>' +
  '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>' +
      '<div class="panel-group" id="operation-tips">'+
      '<div class="panel panel-default">' +
        '<div class="panel-heading">' +
          '<h4 class="panel-title">' +
          '<a data-toggle="collapse" href="#collapse1" style="color:white !important"> operation tips</a>' +
           '</h4>' +
        '</div>' +
        '<div id="collapse1" class="panel-collapse collapse">' +
          '<ul class="list-group">' +
            '<li class="list-group-item">One</li>' +
            '<li class="list-group-item">Two</li>' +
            '<li class="list-group-item">Three</li>' +
          '</ul>' +
          '<div class="panel-footer">Footer</div>' +
          '</div>' +
        '</div>' +
      '</div>'

		$("body").append($toolbar);

	},




	attachToolbar: function () {
		var $toolbar = '<div id="-selector-toolbar">' +
			'<div class="list-item"><div class="selector-container"><textarea id = "element_xpath" class="selector" style = "width:100%; height:26px; text-align:right; overflow:hidden; resize: none "></textarea></div></div>' +
			'<div class="list-item highlight-button">Highlight</div>' +
			'<div class="list-item done-selecting-button">Close</div>' +
			'</div>';
		$("body").append($toolbar);


		$("body #-selector-toolbar .highlight-button").click(function () {
      console.log('click done');
			this.highlightSelection();
		}.bind(this));

		$("body #-selector-toolbar .done-selecting-button").click(function () {
      console.log('click done');
			this.selectionFinished();
		}.bind(this));
	},



	attachToolbarURL: function () {
		var $toolbar = '<div id="-selector-toolbar">' +
			'<div class="list-item"><div class="selector-container"><textarea id = "element_xpath" class="selector" style = "width:100%; height:26px; text-align:right;overflow:hidden; resize: none"></textarea></div></div>' +
			'<div class="list-item highlight-button">Highlight</div>' +
			'<div class="list-item done-selecting-button">Close</div>' +
			'<div class="row" style="width:100%"></div><div class="list-item-abs"><div class="selector-container"><textarea id = "element_abs_xpath" class="selector" style = "width:100%; height:26px; text-align:right; overflow:hidden; resize: none" ></textarea></div></div> <div class="list-item disable-button">Abs XPath of mouseover element</div>' +
			'</div>';
		$("body").append($toolbar);


		$("body #-selector-toolbar .highlight-button").click(function () {
      console.log('click done');
			this.highlightSelection();
		}.bind(this));

		$("body #-selector-toolbar .done-selecting-button").click(function () {
      console.log('click done');
			this.selectionFinished();
		}.bind(this));
	},


	highlightParent: function () {
		// do not highlight parent if its the body
		if(!$(this.parent).is("body") && !$(this.parent).is("#webpage")) {
			$(this.parent).addClass("-sitemap-parent");
		}
	},

	unbindElementSelection: function () {
		$(this.$allElements).unbind("click.elementSelector");
		// remove highlighted element classes
		this.unbindElementSelectionHighlight();
	},
	unbindElementSelectionHighlight: function () {
		$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
		$(".-sitemap-parent").removeClass('-sitemap-parent');
	},
	unbindElementHighlight: function () {
		$(this.$allElements).unbind("mouseover.elementSelector")
			.unbind("mouseout.elementSelector");
	},
	unbindKeyboardSelectionMaipulatios: function () {
		$(document).unbind("keydown.selectionManipulation");
		clearInterval(this.keyPressFocusInterval);
	},
	removeToolbar: function () {
    console.log('remove tool bar')
		$("body #-selector-toolbar a").unbind("click");
		$("#-selector-toolbar").remove();
	},

	/**
	 * Remove toolbar and unbind events
	 */
	removeGUI: function() {

		this.unbindElementSelection();
		this.unbindElementHighlight();
		this.removeToolbar();
		//this.unbindKeyboardSelectionMaipulatios();
		//this.unbindMultipleGroupPopupHide();
		//this.unbindMultipleGroupCheckbox();
		//this.unbindMoveImagesToTop();
	},

	highlightSelection: function () {
   	$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
	  this.resultXpath = document.getElementById("element_xpath").value;
		try {
      var res = document.evaluate(this.resultXpath, document);


      let listElements = [];
      while(node = res.iterateNext()) {
        listElements.push(node)
      }
      for (var i = 0; i < listElements.length; i++) {
        $(listElements[i]).addClass('-sitemap-select-item-selected');
      }

		}
		catch(err) {
			if(err === "found multiple element groups, but allowMultipleSelectors disabled") {
				console.log("multiple different element selection disabled");

				this.showMultipleGroupPopup();
				// remove last added element
				this.selectedElements.pop();
				this.highlightSelectedElements();
			}
		}

		//var resultCssSelector = this.resultXpath;//this.getCurrentCSSSelector();

	},

	selectionFinished: function () {
    console.log(this.resultXpath)
		//var resultCssSelector = this.resultXpath;//this.getCurrentCSSSelector();

		this.deferredCSSSelectorResponse.resolve({
			CSSSelector: this.resultXpath
		});
	}
};
