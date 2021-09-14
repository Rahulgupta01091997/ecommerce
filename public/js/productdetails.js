
function addReview() {
    var formData = $(".ps-product__review").serialize()
        // console.log(formData)
    $.ajax({
        url: 'addreview',
        type: 'post',
        data: formData,
        success: function(response) {
            Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Review is sent for moderation.',
                    showConfirmButton: false,
                    timer: 1500
                })
                // }
            $('.ps-product__review').collapse('toggle')
                // $("#myrating").css('width',((response.rating/5)*100)+'%')
            $("#myrev").remove();
            // }
            location.reload();
        }
    })
}

$(document).ready(function() {
    var ratval = $("#newrating").val() ? $("#newrating").val() : 0;
    $('.ps-new-rating').rateYo({
        rating: ratval,
        fullStar: true,
        color: '#F4C150',
        starWidth: '20px',
        // normalFill:"B0B0B0",
        onSet: function(rating, rateYoInstance) {
            $("#newrating").val(rating); //setting up rating value to hidden field
        }
    });
});
