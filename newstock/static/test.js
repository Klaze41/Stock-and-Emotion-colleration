document.addEventListener("DOMContentLoaded", function() {
    const data = JSON.parse(document.getElementById('my-chart').getAttribute('data-chart'));
    const update_data = JSON.parse(document.getElementById('my-chart').getAttribute('update'));
    console.log(update_data);
    const chartOptions = {
        layout: {
            textColor: 'black',
            background: {
                type: 'solid',
                color: 'white'
            }
        }
    };
    const chart = LightweightCharts.createChart(document.getElementById('chart-container'), chartOptions);
    const areaSeries = chart.addAreaSeries({
        lineColor: '#2962FF',
        topColor: '#2962FF',
        bottomColor: 'rgba(41, 98, 255, 0.28)'
    });

    const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350'
    });
    candlestickSeries.setData(data);

    const volumeSeries = chart.addHistogramSeries({
        color: 'rgba(0, 150, 136, 0.4)',
        lineWidth: 2,
        priceFormat: {
            type: 'volume'
        },
        priceScaleId: '',
        scaleMargins: {
            top: 0.8,
            bottom: 0
        }
    });

    const volumeData = data.map((d) => ({ time: d.time, value: d.volume, color: d.close > d.open ? 'rgba(0, 150, 136, 0.4)' : 'rgba(239, 83, 80, 0.4)' }));
    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();

    const newData = update_data;

    let i = 0;
    setInterval(function() {
        candlestickSeries.update(newData[i]);
        volumeSeries.update({ time: newData[i].time, value: newData[i].volume, color: newData[i].close > newData[i].open ? 'rgba(0, 150, 136, 0.4)' : 'rgba(239, 83, 80, 0.4)' });
        i++;
        if (i >= newData.length) {
            clearInterval(this);
        }
        console.log(typeof newData[i].time);
        console.log('/getInfo/'+ newData[i].time + '/');

        $.ajax({
            type: 'GET',
            url : '/getInfo/'+ encodeURIComponent(newData[i].time) + '/',
            success:function(response){
                console.log(response);
                for (var key in response.info){
                    var temp="<div class='container darker'><b>"+response.info[key].title+"</b><p>"+response.info[key].time+"</p>"+response.info[key].detail+"</div>";
                    $("#display").append(temp);
                }
                console.log('Ajax request succeeded!');
            },
            error: function(response){
                alert('error')
            }
        });
        
    }, 10000); // 60000 ms = 1 minute

    const submitButton = document.getElementById('submit');
    $(document).on('submit','form',function(e){
    
        // Send an AJAX request with the current value of i
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/send',
            data: { 
                time: newData[i].time ,
                slide: $('#slide').val()
            },
                headers: { 'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val() 
            },
            
            success: function(data) {
                console.log('Success!' + newData[i].time);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
});
