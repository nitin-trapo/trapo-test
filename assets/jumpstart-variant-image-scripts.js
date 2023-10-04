var $product_img_cell = $(".variant_imgs_cell"), 
    $product_img_cell_array = [],
    $product_slider = $("#productImg").flickity(); 
	$product_slider.flickity("destroy"), 
    $(function () { 
        productImgArray(), imageUpdater();
    }),
    (productImgArray = () => {
        $product_img_cell.each(function () {
            var r = $(this);
            $product_img_cell_array = $product_img_cell_array.concat(r);
        });
    }),
    (getSelectedVariantValue = () => {
        var a = "";
        return (
            $(".swatch_alt_val").each(function () {
                var r = $(this);
                r.prop("checked") && ((r = r.val()), (a += r + "-"));
            }),
            (a = a.replace(/-\s*$/, ""))
        );
    }),
    (imageUpdater = (r) => {
        var t = getSelectedVariantValue(),
            a = 0;
      
    if(t == "''"){
        $(".standardshippingoxtra").show();
        $('.add_to_cart').text('Pre-order');
    //      }else if (t == "16''") {
    //      $(".standardshippingoxtra").show();
    //     $('.add_to_cart').text('Pre-order');
    //   }else if (t == "22''") {
    //      $(".standardshippingoxtra").show();
    //     $('.add_to_cart').text('Pre-order');
        
    //      }else if (t == "26'/14'") {
    //       $(".standardshippingoxtra").show();
      
    //     $('.add_to_cart').text('Pre-order');
    //   }else if (t == "30'/14'") {
    //       $(".standardshippingoxtra").show();
       
    //     $('.add_to_cart').text('Pre-order');
    //   }else if (t == "24'/14'") {
    //     $(".standardshippingoxtra").show();
        
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "28'/14'") {
    //      $(".standardshippingoxtra").show();
       
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "16'/14'") {
    //      $(".standardshippingoxtra").show();      
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "24'/14'") {
    //   $(".standardshippingoxtra").show();
       
    //     $('.add_to_cart').text('Pre-order');
    //      }else if (t == "21'/14'") {
    //         $(".standardshippingoxtra").show();
        
    //     $('.add_to_cart').text('Pre-order');
    //   }else if (t == "22'/16'") {
    //            $(".standardshippingoxtra").show();
        
    //     $('.add_to_cart').text('Pre-order');
    //   }else if (t == "18'/16'") {
    //      $(".standardshippingoxtra").show();
       
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "16'/16'") {
    //           $(".standardshippingoxtra").show();
       
    //     $('.add_to_cart').text('Pre-order');
    //   }else if (t == "26'/16'") {
    //             $(".standardshippingoxtra").show();
    //       $('.add_to_cart').text('Pre-order');
    //   }else if (t == "24'/16'") {
    //             $(".standardshippingoxtra").show();
       
    //     $('.add_to_cart').text('Pre-order');
    //   }else if (t == "22'/21'") {
    //           $(".standardshippingoxtra").show();
        
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "22'/18'") {
    //           $(".standardshippingoxtra").show();
      
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "22'/22'") {
    //            $(".standardshippingoxtra").show();
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "22'/19'") {
    //            $(".standardshippingoxtra").show();
        
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "22'/26'") {
    //            $(".standardshippingoxtra").show();
        
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "22'/17'") {
    //            $(".standardshippingoxtra").show();
    
    //     $('.add_to_cart').text('Pre-order');
    // }else if (t == "22'/14'") {
    //            $(".standardshippingoxtra").show();
        
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "22'/24'") {
    //            $(".standardshippingoxtra").show();

    //     $('.add_to_cart').text('Pre-order');
  
    //   }else if (t == "26'/24'") {
    //     $(".standardshippingoxtra").show();
         
    //     $('.add_to_cart').text('Pre-order');
    //   }else if (t == "24'/24'") {
    //           $(".standardshippingoxtra").show();
        
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "24'/22'") {
    //     $(".standardshippingoxtra").show();
    //     $('.add_to_cart').text('Pre-order');
    //  }else if (t == "22'/19'") {
    //           $(".standardshippingoxtra").show();
        
        $('.add_to_cart').text('Pre-order');
     }else if (t == "22'/18'") {
              $(".standardshippingoxtra").show();
       
        $('.add_to_cart').text('Pre-order');
     }else if (t == "22'/20'") {
              $(".standardshippingoxtra").show();
        
        $('.add_to_cart').text('Pre-order');
     // }else if (t == "24'/21'") {
     //          $(".standardshippingoxtra").hide();
     //     $(".standardshippingoxtra-2").show()
     //    $('.add_to_cart').text('Pre-order');
     // }else if (t == "24'/15'") {
     //             $(".standardshippingoxtra").hide();
     //     $(".standardshippingoxtra-2").show()
     //    $('.add_to_cart').text('Pre-order');
     // }else if (t == "24'/17'") {
     //             $(".standardshippingoxtra").hide();
     //     $(".standardshippingoxtra-2").show()
     //    $('.add_to_cart').text('Pre-order');
     //  }else if (t == "20'/20'") {
     //          $(".standardshippingoxtra").show();
     //     $(".standardshippingoxtra-2").hide()
     //    $('.add_to_cart').text('Pre-order');
     // }else if (t == "26'/20'") {
     //          $(".standardshippingoxtra").show();
     //     $(".standardshippingoxtra-2").hide()
     //    $('.add_to_cart').text('Pre-order');
     // }else if (t == "25'/20'") {
     //           $(".standardshippingoxtra").show();
     //     $(".standardshippingoxtra-2").hide()
     //    $('.add_to_cart').text('Pre-order');
     // }else if (t == "21'/20'") {
     //           $(".standardshippingoxtra").show();
     //     $(".standardshippingoxtra-2").hide()
     //    $('.add_to_cart').text('Pre-order');
     // }else if (t == "23'/20'") {
     //           $(".standardshippingoxtra").show();
     //     $(".standardshippingoxtra-2").hide()
     //    $('.add_to_cart').text('Pre-order');
     //   }else if (t == "22'/20'") {
     //     $(".standardshippingoxtra").show();
     //     $(".standardshippingoxtra-2").hide()
     //    $('.add_to_cart').text('Pre-order');
      }else {
        $(".standardshippingoxtra").hide();
        if($.trim($('.add_to_cart').text()) === 'Pre-Order'){
              console.log($('.add_to_cart').text());
          }else{
            $('.add_to_cart').text('Add to Cart');
          }
      }
 

      
      if ($('.shopify-product-form > div.display-70mai').length > 0) {
      $(".store-pickup-message").remove();
      var str2 = "with Installation";
      var swatchArr = t.split('-');
      console.log(swatchArr[0]);
      if(t.indexOf(str2) != -1){
          console.log(str2 + " found");
        $("[data-value='"+swatchArr[0]+"']").after( "<p class='store-pickup-message'>Select 'Store Pickup' on cart for installation at your nearest TRAPO hub, excluding TRAPO Mid Valley.</p>" );
      }
      }
      
      if ($('.swatch > div.option_title:contains("Packages")').length > 0) {
        var radioValue = $("input[name='properties[Transmission]']:checked").val();
        var altArray = t.split('-');
        console.log(altArray);
        var newAltArr = altArray.slice(0, -1); 
        newAltArr.splice(1, 0, radioValue)
        console.log(newAltArr);
        var altStr = newAltArr.toString();
        console.log(altStr);
        var t = altStr.replace(/,/g, '-');
		console.log(t); 
      }
      
      if(t == "Black-Automatic-Red"  || t == "Black-Automatic-Black"){
        $(".express-shipping").show();
        $(".standard-shipping").hide();
        
      }else{
        $(".express-shipping").hide();
        $(".standard-shipping").show();
      }
        $product_img_cell.each(function () {
            $(this).remove();
            for (var r = 0; r < $product_img_cell_array.length; r++) {
                var a = $product_img_cell_array[r].attr("data-variant_img_alt");
                (t != a && "main_image" != a) || $("#productImg .flickity-slider").append($product_img_cell_array[r]);
            }
        }),
            (a = r ? 1 : 0),
            $product_slider.flickity("destroy"),
            $("#productImg").flickity({ pageDots: !0, initialIndex: a });
    }),
    (changeSwatch = (r) => {
        $(r);
        setTimeout(function () {
            imageUpdater(!0);
        }, 500);
    });
