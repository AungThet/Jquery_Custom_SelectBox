	
	(function(){
		$.fn.create_select = function(option){

			var setting = $.extend(
			{
				data: [{"key":1,"value":"Januray"},{"key":2,"value":"Febuary"},{"key":1,"value":"March"},{"key":1,"value":"April"},{"key":1,"value":"May"},{"key":1,"value":"June"},{"key":1,"value":"July"},{"key":1,"value":"August"},{"key":1,"value":"September"},{"key":1,"value":"October"},{"key":1,"value":"November"},{"key":1,"value":"December"}]
			}
			,$.fn.create_select.default,option);

			var list = setting.data ;

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
			bind_option(list);

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
				var selected = list[$(this).index()];
				bindSelect(selected);
			});
			
			select_box.focus(function(){
				key = new Array();
				$(document).keydown(function(e){
					if(e.keyCode==40){
						if(option_box.is(':visible')){
							operate(e);	
						}
						else{
							option_box.show();	
							scroll_index();
						}
						key = new Array();
					}
					else{
						operate(e);							
					}
					return false;
				});
			});

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
					ul.append(li.clone().addClass(value.key+" option").text(value.value));
				});

				select_box.append(ul);
			}

			//initiate value 
			function value_initiate(){
				bindSelect(list[0]);
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
			function shift_index(input_string, option_list,type){

				//get option list
				var option_list = option_list;
				//get typed string
				var item = input_string.toLowerCase().split('');

				//if type string length greater than 0
				if(item.length>0){

					//set item found status to false
					var found = false;

					//loop list to match each option to item
					$.each(option_list,function(index,value){
						var array = value.toLowerCase().split('');

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
										set_active(index);
										if(type){
											var selected = list[select_box.find('.active').index()];
											bindSelect(selected);
										}
										//start count for watch time to reset item's string after a specific time (2s)
										start_count();
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

			//counter to reset item's string
			function start_count(){
				var first = key;
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
					key = new Array();
					console.debug('reset');
				},1500);
			}

			//scroll to a specifice index 
			function scroll_index(){
				var option_height = option_box.find('.option').height();
				var index = option_box.find('.active').index();
				option_box.scrollTop(option_height*index);
			}

			// add active class to a specific index
			function set_active(index){
				option_box.find('.option').removeClass('active');
				option_box.children('.option:nth-child('+(index+1)+')').addClass('active');
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
						shift_index(input_string, option_list,false);
					}
				}
				//if combo option box is not visible
				else{
					//push typed key to key arrray
					key.push(e.keyCode); 
					//convert key array to string
					var input_string = out(key);
					//compare character and scroll to matched option
					shift_index(input_string, option_list,true);
				}
			}
		}
	})($);
