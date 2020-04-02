function l(u, i) {
    var d = document;
    if (!d.getElementById(i)) {
        var s = d.createElement('script');
        s.src = u;
        s.id = i;
        d.body.appendChild(s);
    }
}

l('//code.jquery.com/jquery-3.4.1.min.js', 'jquery');

function isIn(urlMatchRegex) {
    return window.location.href.match(urlMatchRegex);
}

const cookItems = {
    greenTea: '緑茶',
    soup: '白玉清湯'
};
let cookItem = '';

if (!('storage' in chrome)) {
    alert('chrome.storage does not exist');
}

console.log({ chrome, storage: chrome.storage });
chrome.storage.local.get('cookItem', function (result) {
    console.log({ cookItem: result });

    cookItem = 'cookItem' in result ? result.cookItem : cookItems.greenTea;

    console.log({cookItem});
    if (isIn(/garden_teatable/)) {
        if (isIn(/garden_teatable_select_recipe/)) {
            if ($('#result').length) {
                var nOutOfN = $('#extension span:last-child').text().split('/');

                if (nOutOfN[0] === nOutOfN[1]) {
                    console.log('身上料理已滿');

                    if (cookItem === cookItems.soup) {
                        debugger;$('#popup input.btn').click();
                        debugger;window.location.href = 'http://msp.musou-online.jp/m/garden_teatable_food_effect';
                    } else {
                        debugger;window.location.href = 'http://msp.musou-online.jp/m/garden_top';
                    }
                } else {
                    const $continueCook = $("a[href^='/m/garden_teatable_blend_confirm']");
                    const $eatPopup = $('#popup_eat input.btn');

                    if ($continueCook.length > 0) {
                        debugger;$continueCook.click();

                        debugger;window.location.href = $continueCook.attr('href');
                    } else if ($eatPopup.length > 0) {
                        debugger;$eatPopup.click();
                    } else {
                        debugger;$('#popup input.btn').click();
                    }
                }
            } else {
                // Find Green tea and select it
                debugger;$(`span.list_name:contains(${cookItem})`).closest("[id^=radioitem]").click();
                setTimeout(() => {
                    debugger;$('#recipe_select_btn').click();
                }, 500);
            }
        }
        if (isIn(/garden_teatable_blend_confirm/)) {
            debugger;$('a[onclick]').click();
            setTimeout(() => {
                debugger;$('input.btn').click();
            }, 500);
        }
        if (isIn(/garden_teatable_result/)) {
            if ($('#content div:contains(料理を破棄しました)').length) {
                if (cookItem === cookItems.soup) {
                    chrome.storage.local.set({
                        'cookItem': cookItems.greenTea
                    },
                    function (data) {
                        debugger;window.location.href = 'http://msp.musou-online.jp/m/garden_top';
                    });
                }
                debugger;window.location.href = 'http://msp.musou-online.jp/m/garden_top';
            } else {
                debugger;window.location.href = 'http://msp.musou-online.jp/m/garden_teatable_select_recipe?recipelisttype=2';
            }
        }
        if (isIn(/garden_teatable_food_effect/)) {
            // Throw one item in food list
            $('#radioitem0').click();
            
            setTimeout(() => {
                debugger;$('#popup input.btn').click();
            }, 1000);

        }
    }
    if (isIn(/garden_top/)) {
        const isAnyPlantStillPlanting = $("span.status:contains(栽培中)");
        if (isAnyPlantStillPlanting) {
            if ($('.infoleft .infonumber:first').text().match(/^0\//)) {
                chrome.storage.local.set({
                        'cookItem': cookItems.soup
                    },
                    function (data) {
                        debugger;window.location.href = 'http://msp.musou-online.jp/m/garden_teatable_select_recipe?recipelisttype=2';
                    }
                );
            }
        }
        // Remove those cannot fill water
        $('#plant_list >[id^=plant_].disabled')
            .map(function (i, each) {
                return each['id'].replace('plant_', '');
            })
            .get()
            .forEach((each) => {
                $('#plant_list #plant_' + each).remove();
                $('#plant_list #plant_info_' + each).remove();
            });
        debugger;$('#plant_list >[id^=plant_]:first').click();
        const intervalId = setInterval(() => {
            const $form = $('#plant_list >[id^=plant_info_] form[action="/m/garden_plant_water"]');
            if ($form.length) {
                debugger;$form.find('input.btn').click();
                clearInterval(intervalId);
            }
        });
        if (isAnyPlantStillPlanting && $('#plant_list >[id^=plant_]').length === 0) {
            setTimeout(() => {
                location.reload();
            }, 30000);
        } else {
            // alert('All planted');
        }
    }
    if (isIn(/garden_plant_water/)) {
        const stillHaveGreenTea = $('.explanation').text().match(/緑茶/);
        if (stillHaveGreenTea && stillHaveGreenTea[0] === '緑茶') {
            debugger;window.location.href = 'http://msp.musou-online.jp/m/garden_top';
        } else {
            // If action point went low, change to make soup
            debugger;window.location.href = 'http://msp.musou-online.jp/m/garden_teatable_select_recipe?recipelisttype=2';
        }
    }
});
