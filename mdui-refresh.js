


function SwipFresh(selector,id = '0') {
    var $this = this;
    $this.id = id;
    var element = document.querySelector(selector);
    if (element == undefined){
        throw new Error("element must not be null!")
    }
    element.innerHTML = element.innerHTML+"<div class='mdui-card' style='position: fixed;top:50px;border-radius: 150px;height: 38px;width: 38px;padding: 9px;' id='mdui-refresh-"+id+"'><div style='width: 20px;height: 20px' class=\"mdui-spinner\" ><div class=\"mdui-spinner-layer \"><div class=\"mdui-spinner-circle-clipper mdui-spinner-left\"><div class=\"mdui-spinner-circle\"></div></div><div class=\"mdui-spinner-gap-patch\"><div class=\"mdui-spinner-circle\"></div></div><div class=\"mdui-spinner-circle-clipper mdui-spinner-right\"><div class=\"mdui-spinner-circle\"></div></div></div></div></div> ";

    $this.spinner = document.querySelector("#mdui-refresh-"+id);

    var centerX = element.offsetWidth/2 - $this.spinner.offsetWidth/2 + element.offsetLeft;
    $this.spinner.style.left = centerX+"px";

    this.view = element;

    var getTouch = function(event){
        return event.changedTouches[0];
    }

    var getPageScroll= function() {
        var xScroll, yScroll;
        if (window.pageYOffset) {
            yScroll = window.pageYOffset;
            xScroll = window.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
            yScroll = document.documentElement.scrollTop;
            xScroll = document.documentElement.scrollLeft;
        } else if (document.body) {// all other Explorers
            yScroll = document.body.scrollTop;
            xScroll = document.body.scrollLeft;
        }
        arrayPageScroll = new Array(xScroll,yScroll);
        return arrayPageScroll;
    };

    var isScrollTopWindow =function(){
        return getPageScroll()[1] == 0;
    }

    $this.spinner.style.top = (- element.offsetTop)+"px";

    $this.swipeTounch = false;
    $this.touchDownY = 0;

    var canRefreshed = false;
    var moveY = 0;
    element.addEventListener('touchstart',function (e) {
        if ($this.top == -1){
            $this.resize();
        }



        canRefreshed = false;
        if ($this.isRefreshing){
            return;
        }

        $this.spinner.style.top = (- $this.top)+"px";

        if (!isScrollTopWindow()){
            console.log("不需要监听")
        }else{
            $this.swipeTounch = true;
            var touch = getTouch(e);
            $this.touchDownY = touch.clientY;
            console.log(touch)
        }
    })

    element.addEventListener('touchmove',function (e) {
        if (!$this.swipeTounch){
            return;
        }
        if ($this.isRefreshing){
            return;
        }
        var touch = getTouch(e);
        moveY = touch.clientY - $this.touchDownY;
        if (moveY/2 <= $this.canFreshY){
            $this.spinner.style.top = (moveY/2)+"px";
            console.log("滑动距离："+moveY/2)
        }else{
            //可以滑动了
            canRefreshed = true;
        }
    })

    element.addEventListener('touchend',function (e) {
        $this.swipeTounch = false;
        $this.touchDownY = 0;
        if ($this.isRefreshing){
            return;
        }
        console.log("松开");
        if (canRefreshed){
            canRefreshed = false;
            $this.setRefresh(true)
            if ($this.onRefreshListener!=null){
                $this.onRefreshListener();
            }
        } else{
            $this.setRefresh(false)
        }
    })
}


SwipFresh.prototype = {
    top: -1,
    id:0,
    view:null,
    spinner:null,
    swipeTounch:false,
    touchDownY:0,
    canFreshY:120,//超过120则为可以刷新
    resize:function () {
        this.top = this.view.offsetTop;
    },
    isRefreshing:false,
    onRefreshListener:null,
    setOnRefreshListener:function(l){
      this.onRefreshListener = l;
    },
    setRefresh:function (b) {
        this.isRefreshing = b;
        if (this.isRefreshing){
            //animate(this.spinner,from,80)
            $("#mdui-refresh-"+this.id).animate({
                top: '100px'
            },200);
        }else{
            $("#mdui-refresh-"+this.id).animate({
                top:(- this.top)+"px"
            },200);
        }
    }
}