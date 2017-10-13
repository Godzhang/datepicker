(function(){
	var Datepicker = function(options){
		this.opt = Object.assign({}, this.DEFAULT, options);
		this.weekDay = ['日', '一', '二', '三', '四', '五', '六'];
		if(this.opt.startfromMonday){
			this.weekDay.push(this.weekDay.shift());
		}
		this.renderHtml = "";
		this.currentTime = new Date();
		this.init();
	}
	Datepicker.DEFAULT = {
		reset: false,		//每次打开是否需要重置到当前月份
		startfromMonday: false  //第一列显示周日或者周一
	}
	Datepicker.prototype = {
		init: function(){
			var self = this;
			//获取当前时间，年月日
			this.currentYear = this.year = this.currentTime.getFullYear();
			this.currentMonth = this.month = this.currentTime.getMonth() + 1;
			this.date = this.currentTime.getDate();

			//添加容器
			this.addBox();
			// this.buildHtml();
			this.bindEvent();
			
		},
		addBox: function(){
			if(!this.box){
				this.box = document.createElement("div");
				this.box.className = this.opt.boxClass;
				this.box.id = "dateBox";
				this.box.style.top = this.opt.input.offsetTop + this.opt.input.offsetHeight + "px";
				this.box.style.left = this.opt.input.offsetLeft + this.opt.input.offsetWidth + "px";
				document.body.appendChild(this.box);
			}				
		},
		bindEvent: function(){
			var self = this;
			var box = this.box;
			//输入框绑定点击事件
			this.opt.input.addEventListener("click", function(event){
				event.stopPropagation();				

				if(self.opt.reset){
					self.buildHtml(self.currentYear, self.currentMonth);
				}else{
					self.buildHtml();
				}

				box.innerHTML = self.renderHtml;
				box.style.display = "block";
			}, false);
			//箭头和日期绑定点击事件
			this.box.addEventListener("click", function(event){
				event.stopPropagation();

				var target = event.target;
				if(target.className.indexOf("prev") > -1){
					self.toLastMonth();
				}else if(target.className.indexOf("next") > -1){
					self.toNextMonth();
				}else if(target.parentNode.className.indexOf("days") > -1 && target.nodeName.toLowerCase() == "a"){
					self.showDate(target.innerHTML);
				}
			}, false);

			document.addEventListener("click", function(){
				box.style.display = "none";
			});
		},
		showDate: function(date){
			//保存点击时的日期
			this.selectedYear = this.year;
			this.selectedMonth = this.month;
			this.selectedDate = date;
			
			var month = this.addZero(this.month),
				date = this.addZero(date);

			var selectDate = this.year + "-" + month + "-" + date;
			this.opt.input.value = selectDate;
			this.box.style.display = "none";
		},
		addZero: function(num){
			return Number(num) < 10 ? "0" + num : num;
		},
		toLastMonth: function(){
			if(this.month == 1){
				this.year--;
				this.month = 12;
			}else{
				this.month--;
			}
			this.buildHtml();
			this.box.innerHTML = this.renderHtml;
		},
		toNextMonth: function(){
			if(this.month == 12){
				this.year++;
				this.month = 1;
			}else{
				this.month++;
			}
			this.buildHtml();
			this.box.innerHTML = this.renderHtml;
		},
		buildHtml: function(year, month){
			//若传参，则使用参数，并将年月设置为参数年月
			if(arguments.length > 0){
				this.year = year;
				this.month = month;
			}

			this.renderHtml = "";
			//添加箭头和日期显示
			this.renderHtml += '<div class="dateTitle clearfix">\
				<a href="javascript:;" class="prev left">&lt;</a>\
				<a href="javascript:;" class="next right">&gt;</a>\
				<span class="dateNow">'+ this.year +'-'+ this.addZero(this.month) +'</span>\
			</div>';
			
			//添加星期
			this.renderHtml += '<ul class="week clearfix">';
			for(var i = 0, len = this.weekDay.length; i < len; i++){
				this.renderHtml += '<li>'+ this.weekDay[i] +'</li>'
			}
			this.renderHtml += '</ul>';
			
			//添加日期
			//计算本月1号是星期几
			var monthFirstDay = new Date(new Date(this.year, this.month-1, this.date).setDate(1)).getDay();
			if(monthFirstDay == 0 && this.opt.startfromMonday){monthFirstDay = 7;}
			//本月天数
			var monthDay = new Date(this.year, this.month, 0).getDate();
			//计算需要显示上个月的天数
			var lastMonthDay = new Date(new Date(this.year, this.month-1, this.date).setDate(0)).getDate();

			this.renderHtml += '<div class="days clearfix">';

			for(var j = 0; j < 42; j++){
				var date_str = j - monthFirstDay + 1;
				//如果本月1号不是第一天，用上个月日期补全
				if(date_str <= 0){
					date_str += lastMonthDay;
					this.renderHtml += '<span>'+ date_str +'</span>';
				}else if(date_str > monthDay){
					//如果超出本月日期，用下个月日期补全
					date_str -= monthDay;
					this.renderHtml += '<span>'+ date_str +'</span>';
				}else{
					this.renderHtml += '<a href="javascript:;" class="'+ this.addClass(date_str) +'">'+ date_str +'</a>';
				}
			}

			this.renderHtml += '</div>';
		},
		addClass: function(date){
			var cls = "";
			if(this.year == this.currentYear && this.month == this.currentMonth && this.date == date){
				cls = "cur";
			}
			if(this.year == this.selectedYear && this.month == this.selectedMonth && this.selectedDate == date){
				cls += " sel";
			}
			return cls;
		}
	}

	window.Datepicker = Datepicker;
})();