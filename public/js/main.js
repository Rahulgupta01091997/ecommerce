(function($) {
    "use strict";
    $(window).on('load', function() {
        $('.ps-loading').addClass('loaded');
    });
})(jQuery);

function addToCart(pid){
    $.ajax({
        url:'/cart',
        type:'post',
        data:{
            pid :pid
        },
        success:function(res){
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'product added to cart successfully.',
                showConfirmButton: false,
                timer: 1500
              })
              location.reload();
        }
    })
}

function removeFromCart(cid){
    $.ajax({
        url:'/delcart',
        type:'post',
        data:{
            cid :cid
        },
        success:function(res){
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'product removed from cart successfully.',
                showConfirmButton: false,
                timer: 1500
              })
              location.reload();
        }
    })
}