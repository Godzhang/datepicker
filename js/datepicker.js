(function(){
	var Datepicker = function(options){
		this.opt = Object.assign({}, this.DEFAULT, options);
		this.weekDay = ['日', '一', '二', '三', '四', '五', '六'];
		this.renderHtml = "";
		this.cols = 7;
		this.init();
	}
	Datepicker.DEFAULT = {

	}
	Datepicker.prototype = {
		init: function(){
			var self = this;
			//获取当前时间，年月日
			var currentTime = new Date();
			this.year = currentTime.getFullYear();
			this.month = currentTime.getMonth() + 1;
			this.date = currentTime.getDate();

			this.buildHtml();

			this.opt.input.onclick = function(){
				self.opt.box.innerHTML = self.renderHtml;
				self.opt.box.style.display = "block";
			}
			
			document.addEventListener("click", function(event){
				var target = event.target;
				if(target.id == "prev"){
					self.toLastMonth();
				}else if(target.id == "next"){
					self.toNextMonth();
				}
			}, false);
		},
		toLastMonth: function(){
			if(this.month == 1){
				this.year--;
				this.month = 12;
			}else{
				this.month--;
			}			
			this.buildHtml();
			this.opt.box.innerHTML = this.renderHtml;
		},
		toNextMonth: function(){
			if(this.month == 12){
				this.year++;
				this.month = 1;
			}else{
				this.month++;
			}
			this.buildHtml();
			this.opt.box.innerHTML = this.renderHtml;
		},
		buildHtml: function(){
			this.renderHtml = "";
			//添加箭头和日期显示
			this.renderHtml += '<div class="dateTitle clearfix">\
				<a href="javascript:;" class="prev left" id="prev">&lt;</a>\
				<a href="javascript:;" class="next right" id="next">&gt;</a>\
				<span class="dateNow">'+ this.year +'-'+ this.month +'-'+ this.date +'</span>\
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
			//本月天数
			var monthDay = new Date(this.year, this.month, 0).getDate();
			//计算需要显示上个月的天数
			var lastMonthDay = new Date(new Date(this.year, this.month-1, this.date).setDate(0)).getDate();

			this.renderHtml += '<div class="days clearfix">';

			for(var j = 0; j < 42; j++){
				var date_str = j - monthFirstDay + 1;
				//如果本月1号不是第一天并且当月不是一月份，用上个月日期补全
				if(date_str <= 0){
					date_str += lastMonthDay;
					this.renderHtml += '<span>'+ date_str +'</span>';
				}else if(date_str > monthDay){
					//如果超出本月日期，用下个月日期补全
					date_str -= monthDay;
					this.renderHtml += '<span>'+ date_str +'</span>';
				}else{
					this.renderHtml += '<a href="javascript:;" class="'+ (this.date == date_str ? 'cur' : '') +'">'+ date_str +'</a>';
				}
			}

			this.renderHtml += '</div>';
		}
	}

	window.Datepicker = Datepicker;
})();