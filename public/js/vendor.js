$(document).ready(function () {
  var pathname = window.location.pathname;
  console.log(pathname)
  $('.headitems > li > a[href="' + pathname + '"]').parent().addClass('active');
});

$('#addnewcategory').on('submit', function(e){
  e.preventDefault();
  $.ajax({
    url: '/newcategories',
    type: 'post',
    data: $("#newCategory").serialize(),
    success: function (res) {
      console.log("entered");
      alert("Category = " + res.category + " was added. Thank You");
      location.reload();
    },
    error: function () {
      console.log("error=" + error)
    }
  });
})

function editcategory(x){
  $(x).siblings('#trashcategorylist').addClass('div-hide');
  $(x).siblings('#savecategorylist').removeClass('div-hide');
  $(x).parent().parent().siblings().children().children().children('.category_header').attr('contenteditable','true');
  // $(x).parent().parent().siblings('.category_header').attr('contenteditable','true');
  $(x).addClass('div-hide');
};

function savecategorydb(x,res){
  var category_updated = document.getElementById("updated_category-"+res).innerHTML;
  console.log(res,category_updated)
  $(x).siblings('#trashcategorylist').removeClass('div-hide');
  $(x).siblings('#editcategorylist').removeClass('div-hide');
  // $(x).parent().parent().siblings('.category_header').attr('contenteditable','true');
  $(x).parent().parent().siblings().children().children().children('.category_header').attr('contenteditable','false');
  $(x).parent().parent().siblings('.category_header').css('color','#fff');
  $(x).addClass('div-hide');
  $.ajax({
    url:'/updateproductcategory',
    type:'put',
    data:{'_id':res,'productCategory':category_updated},
    success:function(res){
      console.log("product Category Updated");
      alert("Category Updated. Thank You")
      location.reload();
    },
    error:function(){
      console.log("error="+ error)
      alert("Failed to Update Category")
    }
  });
}


function deletecategorydb(x) {
  console.log(x)
  $.ajax({
    url: '/deletecategory',
    type: 'delete',
    data: { '_id': x },
    success: function (res) {
      console.log("category  deleted");
      alert("Category  was deleted. Thank You")
      location.reload();
    },
    error: function () {
      console.log("error=" + error)
      alert("failed to delete category")
    }
  });
}

$("#addnewproductform").submit(function (e) {
  e.preventDefault();
  var formdata = new FormData(document.getElementById("addnewproductform"));
  for (var value of formdata.values()) {
    console.log(value);
  }
  $.ajax({
    url: '/addnewProduct',
    type: 'post',
    data: formdata,
    processData: false,
    contentType: false,
    success: function (res) {
      console.log("response = " + res)
      alert("Book " + res.Title + " was added. Thank You");
      location.reload();
    },
    error: function () {
      console.log("error=" + error)
    }
  });
});

$("#editproductform").submit(function (e) {
  e.preventDefault();
  var formdata = new FormData(document.getElementById("editproductform"));
  var id = window.location.href.split('/')
  // console.log(id[id.length-1]) 
  formdata.append('_id',id[id.length-1])
  for (var value of formdata.values()) {
    console.log(value);
  }
  $.ajax({
    url: '/editProductDetails',
    type: 'post',
    data: formdata,
    processData: false,
    contentType: false,
    success: function (res) {
      console.log("response = " + res)
      alert("Book was Updated. Thank You");
      location.reload();
    },
    error: function () {
      console.log("error=" + error)
    }
  });
});

function getidOfCheckedCheckboxes(checkboxes){
  var subcategory_name= [];
  var allimages = [];

  if (checkboxes && checkboxes.length > 0) {
    for (var i = 0; i < checkboxes.length; i++) {
      var cb = checkboxes[i];

      if (cb.checked) {
        subcategory_name.push(cb.getAttribute("name"));
        // console.log(cb.getAttribute("name"))
        allimages = allimages.concat(JSON.parse(cb.value))
      }
    }
  }
  // console.log(subcategory_name)
  return [subcategory_name,allimages];
}



function deleteselectedProduct() {
  var modelCbs = document.querySelectorAll(".productcheckbox ");
  var models = getidOfCheckedCheckboxes(modelCbs)
  var idmodel = models[0];
  var imgmodel = models[1];
  console.log(idmodel)
  console.log(imgmodel)
  $.ajax({
    url:'/deleteselectedproduct',
    type:'delete',
    data:{'id_list':idmodel,'prodimg':imgmodel},
    success: function (res) {
      console.log("selected product deleted");
      alert("product  was deleted. Thank You")
      location.reload();
    },
    error: function () {
      console.log("error=" + error)
    }
  });
}

function deleteproduct(res) {
  // console.log(res.split(','))
  var product_data = res.split(',');
  console.log(product_data)
  // console.log($("#prodimg-"+product_data[0]).val())
  $.ajax({
    url: '/deleteproduct',
    type: 'delete',
    data: { '_id': product_data[0], 'path': $("#prodimg-"+product_data[0]).val()},
    success: function (res) {
      console.log("product deleted");
      alert("product  was deleted. Thank You")
      location.reload();
    },
    error: function () {
      console.log("error=" + error)
      alert("failed to delete product")
    }
  });
}

function changestatus($x,res){
  var order_data = res.split(',');
  console.log(order_data);
  // var selectBox = document.getElementById("status");
  // var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  console.log($x);
  var statusdata = {'_id':order_data[0],'previous_status':order_data[1],'update_status' : $x};
  console.log(statusdata)
  // $.ajax({
  //     url:'/changeorderstatus',
  //     type:'post',
  //     data: statusdata,
  //     success:function(res){
  //     console.log("order status Updated");
  //     alert("order status Updated. Thank You")
  //     location.reload();
  //     },
  //     error:function(){
  //     console.log("error="+ error)
  //     alert("failed to update status")
  //     }
  // });
}

function reviewstatus(status,reviewid){
  console.log("status = "+status+" reviewid = "+ reviewid);
  $.ajax({
    url:'/updatereviewstatus',
    type:'put',
    data: {'_id':reviewid,'status':status},
    success:function(res){
        alert("Review Status Updated. Thank You");
        location.reload();
    },
    error:function(){
      console.log("error")
      alert("Error occured")
    }
  });
}

function deleteuser(delid){
  console.log(delid)
  $.ajax({
    url: '/deleteuser',
    type: 'delete',
    data: {'_id': delid},
    success: function(res){
      alert("User Deleted")
      location.reload()
    },
    error: function(err){
      alert("Failed to delete User")
      location.reload()
    }
  })
}

$("#newuserForm").on('submit', function(e){
  e.preventDefault();   
  if ((document.eshopform.name.value).length < 3) {
    //alert("Please Enter a valid Name");
    document.getElementById("fullname").style.display = "block";
    return false;
  }
  else if ((document.eshopform.name.value).length >= 3) {
    document.getElementById("fullname").style.display = "none";
  }
  if ((document.eshopform.password.value).length < 8) {
      //alert("Length of the password must be minimum 8");
      document.getElementById("password").style.display = "block";
      return false;
  }
  else if ((document.eshopform.password.value).length >= 8) {
    document.getElementById("password").style.display = "none";
  }
  console.log($("#newuserForm").serialize())
  $.ajax({
    url:'/addnewuser',
    type:'post',
    data:$("#newuserForm").serialize(),
    success:function(res){
      if(res==1){
        alert("User Added Successfully")
        location.reload()
      }
      else if(res==0){
        $("#email").show();
      }
    },
    error:function(){
      $("#email").show();
    }
  });
})