function reverse(s){
    return s.split("").reverse().join("");
}

mn=0

function reline(n){
    N=2**n;
    sqn = Math.sqrt(N);
    theta = Math.asin(1/sqn);
    var ctx = document.getElementById("myvec").getContext('2d');
    ctx.beginPath();
    ctx.moveTo(175,175);
    ctx.lineTo(175+120*Math.cos((mn+1)*theta) , 175-120*Math.sin((mn+1)*theta));
    ctx.font="13pt Calibri";
    ctx.fillText("|s>",175+120*Math.cos((mn+1)*theta),175-120*Math.sin((mn+1)*theta));
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#6CAFB7';
    ctx.stroke();
    mn=mn+2;
}

function redraw(){
    var ax = document.getElementById("myvec").getContext('2d');
    ax.clearRect(0, 0, 350, 350);
    ax.font="13pt Calibri";
    ax.fillText("|w>",145,25);
    ax.fillText("|s'>", 326,200);
    ax.beginPath();
    ax.strokeStyle = '#000000';
    ax.moveTo(0,175);
    ax.lineTo(350,175);
    ax.lineWidth = 3;
    ax.stroke();

    ax.beginPath();
    ax.moveTo(175,0);
    ax.lineTo(175,350);
    ax.lineWidth = 3;
    ax.stroke();
}

function successCallBack(returnData) {
    lbl=[];
    val=[];
    for (var key in returnData){
        lbl.push(reverse(String(key)));
        val.push(returnData[key]);
    }
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: lbl,
        datasets: [{
            label: "Probability",
            backgroundColor: '#6CAFB7',
            borderColor: '#6CAFB7',
            data: val,
        }]
    }
    });

    redraw();
    reline($('#noq').val());
}

function resetCallBack() {
    document.getElementById('myChart').getContext('2d').destroy();
    mn=0;
}

$(document).ready(function() {

    var slider = document.getElementById("br");
    var output = document.getElementById("bts");
    var now,smanx;
    $('#oprs').hide();
    $('#resrow').hide();

    $("#set").click(function() {
        if($('#noq').val()){
            now = $('#noq').val();
            smax = 2**now - 1;
            var qn = {};
            qn['n']=now;
            qn['type']=0;
            $('#oprs').show()
            $('#resrow').show();
            $('#br').attr('max', String(smax));
            $('#noq').val(String(now));
            $.ajax({
    			type: 'POST',
    			url: window.location.href,
    			data: JSON.stringify(qn),
    			contentType: 'application/json;charset=UTF-8',
                success: successCallBack
    		});
        }
    });

    $('#br').on("change mousemove", function() {
        var x = (parseInt(this.value)).toString(2);
        var str = "0".repeat(now-x.length) + x;
        output.innerHTML = str;
    });

    $("#grover").click(function() {
        var response={};
        response['numq']=$('#noq').val();
        response['bits']=$('#bts').text();
        response['type']=1;
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: JSON.stringify(response),
            contentType: 'application/json;charset=UTF-8',
            success: successCallBack
        });
    });

    $("#reset").click(function() {
        $('#noq').val("");
        $('#oprs').hide();
        $('#resrow').hide();
        redraw();
        mn=0;
        var response={};
        response['type']=2;
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: JSON.stringify(response),
            contentType: 'application/json;charset=UTF-8',
            success: resetCallBack
        });
    });
});
