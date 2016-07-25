	
	(function(){
		$.fn.create_select = function(option){

			var setting = $.extend(
			{
				data: [{"key":1,"value":"Januray"},{"key":2,"value":"Febuary"},{"key":3,"value":"March"},{"key":4,"value":"April"},{"key":5,"value":"May"},{"key":6,"value":"June"},{"key":7,"value":"July"},{"key":8,"value":"August"},{"key":9,"value":"September"},{"key":10,"value":"October"},{"key":11,"value":"November"},{"key":12,"value":"December"}]
			}
			,$.fn.create_select.default,option);

			var dataSource = {
			data :  [{"key":1,"value":"Januray"},{"key":2,"value":"Febuary"},{"key":3,"value":"March"},{"key":4,"value":"April"},{"key":5,"value":"May"},{"key":6,"value":"June"},{"key":7,"value":"July"},{"key":8,"value":"August"},{"key":9,"value":"September"},{"key":10,"value":"October"},{"key":11,"value":"November"},{"key":12,"value":"December"}]
			,setData : function(list){
				if(this.checkValidData(list)){
					this.data = list;
				}
			}
			,getData: function(){
				if(this.checkValidData(this.data)){
					return this.data;
				}
			}
			,getFirstData : function(){
				if(this.checkValidData(this.data)){
					return this.data[0];
				}
			}
			,getLastData :  function(){
				if(this.checkValidData(this.data)){
					return this.data[this.data.length - 1];
				}
			}
			,getDataByIndex : function(index){
				if(this.checkValidData(this.data)){
					return this.data[index];
				}
			}
			,getDataByKey : function(key){
				if(this.checkValidData(this.data)){
					return this.data.filter(function(obj){
						return obj.key === key;
					})[0];
				}
			}
			,getDataByValue : function(value){
				if(this.checkValidData(this.data)){
					return this.data.filter(function(obj){
						return obj.value === value;
					})[0];
				}
			}
			,checkValidData: function(data){
				if(data instanceof Array){ // check list is array or not
					if(data[0].key && data[0].value){ // check if valid object array 
						return true;
					}
					else{
						return false;
					}	
				}
				else {
					return false;
				}
			}

		};

		var elementSource = {
			elements : []
			,getElements : function(){
				return this.elements;
			}
			,setElements : function(elements){
				this.elements = elements;
			}
			,pushElement : function(element){
				this.elements.push(element);
			}
			,getElementByObj : function(object){
				return this.elements.filter(function(obj){
					return obj.hasClass(object.key) && obj.text() === object.value;
				})[0];
			}
			,getElementByKey : function(key){
				return this.elements.filter(function(obj){
					return obj.hasClass(key);
				})[0];
			}
			,getElementByValue : function(value){
				return this.elements.filter(function(obj){
					return obj.text() === value;
				})[0];
			}
		};

		var keyGenerator = {
			key : []
			,getKey : function(){
				return this.key;
			}
			,getKeyString: function(){
				var result ="";
				$.each(this.key,function(index, value){
					result += String.fromCharCode(value).toLowerCase();
				});
				return result;
			}
			,pushKey : function(value){
				this.key.push(value);
			}
			,resetKey : function(){
				this.key = [];
			}
			,startCounter : function(){
				var $this = this;
				var watcher ;
				try{
					//if watcher timeout is set
					clearTimeout(watcher);
				}
				catch(err){
					console.debug('no timer is set');
				}
				//set time to reset item's string
				watcher = setTimeout(function(){
					//reset item's string
					$this.key = [];
				},1500);
			}

		};

			dataSource.setData(setting.data);

			var select_box = $(this);

			$(this).wrap("<div class='search_container'>");

			var container = $(this).parent();
			var hidden_select = $('<select>',{class:setting.class, name: setting.name});

			hidden_select.hide();

			container.append(hidden_select);

			var hidden_select = $(this).siblings('select');

			var div_select = $('<div>',{class:"select_month"});
			var div_value = $('<div>',{class:"value"});

			var down_icon  = $('<div>',{class:"arrow"});

			div_select.append(div_value);

			select_box.append(div_select, down_icon);

			//bind option to select box
			bind_option(dataSource.getData());

			select_box.attr('tabindex',0);
			var select = select_box.children().first();
			var option_box = select_box.children().last();
			var option_list = get_option_list();
			var key,time_count;

			value_initiate();

			select_box.on('click',function() {
				option_box.toggle();
				key = new Array();
			});

			option_box.children('.option').click(function(){
				$(this).siblings().removeClass('active');
				$(this).addClass('active');
				var selected = dataSource.getDataByIndex($(this).index());
				bindSelect(selected);
			});

		$(document).keydown(function(e){
			if(select_box.is(":focus")){
					key = new Array();
					
					if(e.keyCode==40){ // down arrow
						if(option_box.is(':visible')){
							goNext(e);
						}
						else{
							option_box.show();	
							scroll_index();
						}
						key = new Array();
					}
					else if(e.keyCode === 38){ // up key
						goPrev(e);
					}
					else if(e.keyCode === 13){ // enter key
						var active = get_active();
						//if there is any active class
						if(active){
							//get text from active class
							var selected = dataSource.getDataByIndex($(active).index());
							//set got text select box of 
							bindSelect(selected);
							option_box.hide();
						}	
						else{
							console.log("no active item");
						}						
					}
					else if(e.keyCode === 27){ // esc key
						option_box.hide();
					}
					else{
						//push typed key to key arrray
						keyGenerator.pushKey(e.keyCode);
						//convert key array to string
						var input_string = keyGenerator.getKeyString();
						//compare character and scroll to matched option
						shift_index(input_string, false);
					}
					return false;
			}
			else{
				console.log("not focus");
			}
		});

		var goPrev = function (e){
			var active = get_active();
			if(active){
				if($(active).prev().index() !== -1){
					set_active($(active).prev());
				}
				else{
					set_active($(active).siblings('li:last-child'));
				}
				
			}
			else{
				set_active(select_box.find(".month_combo").last());
			}
		};
		var goNext = function (e){
			var active = get_active();
			if(active){
				if($(active).next().index() !== -1){
					set_active($(active).next());
				}
				else{
					set_active(select_box.find(".month_combo").children("li:first"));
				}
				
			}
			else{
				set_active(select_box.find(".month_combo").children("li:first"));
			}
		};

			//clear hidden select box
			function clearSelect(){
				hidden_select.html('');
			}

			//bind option to hidden select
			function bindSelect(obj){
				clearSelect();
				div_value.text(obj.value || console.error(obj)).end().attr('key', obj.key);
				hidden_select.append("<option value=\""+obj.key+"\" selected=\"selected\">"+obj.value+"</option>");
			}

			//bind option list to select box
			function bind_option(list){
				var ul = $('<ul>',{class:"month_combo"});
				var li = $('<li>');

				$.each(list, function(index,value){
					var element = li.clone().addClass(value.key+" option").text(value.value);
					elementSource.pushElement(element);
					ul.append(element);
				});

				select_box.append(ul);
				
			}

			//initiate value 
			function value_initiate(){
				bindSelect(dataSource.getFirstData());
			}

			//get option list from select box
			function get_option_list(){
				var array = new Array();
				$.each(option_box.find('.option'),function(index, value){
					array.push(value.textContent);
				});
				return array;
			}	

			//create typed keycode to string
			function out(data){
				var result ='';
				$.each(data,function(index, value){
					result += String.fromCharCode(value).toLowerCase();
				});
				return result;
			}

			//do auto complete operation 
			function shift_index(input_string, type){
				var option_list = dataSource.getData();
				//get typed string
				var item = input_string.toLowerCase().split('');

				//if type string length greater than 0
				if(item.length>0){
					//set item found status to false
					var found = false;
					//loop list to match each option to item
					$.each(option_list,function(index,obj){
						var array = obj.value.toLowerCase().split('');

						//to check item's last character
						var last = item.length-1;

						//to index current char of item
						var pointer = 0;

						//loop each character of current option 
						$.each(array,function(ind,val){

							// if not match found, item.lenght>0 and not greater item's last character
							if(!found && val.length>0 && pointer<=last){
								//if current option's char is equal item's current char
								if(val.toLowerCase()==item[pointer]){
									//if match until last char
									if(pointer==last){
										//scroll to that option index
										scroll_index();
										//set active class to that option

										set_active(elementSource.getElementByValue(obj.value));
										if(type){
											var selected = dataSource.getDataByIndex(select_box.find('.active').index());
											bindSelect(selected);
										}
										//start count for watch time to reset item's string after a specific time (2s)
										keyGenerator.startCounter();
										//item's char index reset to start
										pointer=0;
										//set found state to true
										found = true;
									}
									else{
										//if not found set current item char index to next
										pointer = pointer+1;
									}

								}	
							}

						});
					});
}
}


			//scroll to a specifice index 
			function scroll_index(){
				var option_height = option_box.find('.option').height();
				var index = option_box.find('.active').index();
				option_box.scrollTop(option_height*index);
			}

			function get_active(){
				return select_box.find(".month_combo").children("li.option.active")[0];
			}

			// add active class to a specific index
			function set_active(item){
				if(!item instanceof jQuery){
					item = $(item);
				}
				option_box.find('.option').removeClass('active');
				item.addClass('active');
				scroll_index();
			}

			//down active option 
			function down_active_option(){
				var current_index = option_box.find('.active').index();
				var test = option_box.children('.option');
				if(current_index<0){
					option_box.children().eq(0).addClass('active');
				}
				else{
					option_box.find('.active').removeClass('active');
					/*option_box.children(':nth-child('+(current_index+2)+')').addClass('active');*/
					option_box.children().eq(current_index+1).addClass('active');
				}
				if(option_box.find('.active').index()==-1){
					option_box.children().eq(0).addClass('active');
				}

				scroll_index();
			}

			function up_active_option(){
				var current_index = option_box.find('.active').index();
				var test = option_box.children('.option');
				if(current_index<0){
					option_box.children().last().addClass('active');
				}
				else{
					option_box.find('.active').removeClass('active');
					/*option_box.children(':nth-child('+(current_index+2)+')').addClass('active');*/
					option_box.children().eq(current_index-1).addClass('active');
				}
				if(option_box.find('.active').index()==-1){
					option_box.children().last().addClass('active');
				}

				scroll_index();
			}

			//main operate function
			function operate(e){
				// if select box is drop 
				if(option_box.is(':visible')){
					//if esc key is pressed
					if(e.keyCode==27){
						//hide select box
						option_box.hide();
					}
					//if enter key is pressed
					else if(e.keyCode==13){
						//if there is any active class
						if(option_box.find('.active').length>0){
							//get text from active class
							var selected = list[option_box.find('.active').index()];
							//set got text select box of 
							bindSelect(selected);
							option_box.hide();
						}
					}
					// down arrow is pressed
					else if(e.keyCode == 40){
						down_active_option();
						key = new Array();
					}
					else if(e.keyCode == 38){
						up_active_option();
						key = new Array();
					}
					//press key not enter nor escape
					else{
						//push typed key to key arrray
						key.push(e.keyCode); 
						//convert key array to string
						var input_string = out(key);
						//compare character and scroll to matched option
						shift_index(input_string, false);
					}
				}
				//if combo option box is not visible
				else{
					//push typed key to key arrray
					key.push(e.keyCode); 
					//convert key array to string
					var input_string = out(key);
					//compare character and scroll to matched option
					shift_index(input_string, true);
				}
			}
		}
	})($);
