// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.remove('dark')
}

// Whenever the user explicitly chooses light mode
localStorage.theme = 'light'

// Whenever the user explicitly chooses dark mode
localStorage.theme = 'dark'

// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem('theme')
$(function(){
    AOS.init();

    var translate = function (jsdata) {
        $("[langKey]").each(function (index) {
            var strTr = jsdata[$(this).attr("langKey")];
            $(this).html(strTr);
            $(this).attr("placeholder", strTr);
        });
    }

    setLanguage(localStorage.getItem("langId") || navigator.language.substring(0,2));
    function setLanguage(langCode){
        var jsonUrl = "../src/assets/lang/" + langCode + ".json";
        $.ajax({
            url: jsonUrl,
            dataType: "json",
            async: false,
            success: translate
        });
    }

    $("button#btnChangeLang").click(function (e) { 
        localStorage.setItem("langId",e.currentTarget.attributes.langid.value);
        setLanguage(localStorage.getItem("langId"));
    });

    var user = new URLSearchParams(window.location.search).get('user')
    
    var bindingData = function BindingData(jsdata) {
        var checkParam = false;
        if(jsdata.length > 0)
        {
            let index = 0;
            jsdata.forEach(element => {
                if(element.user === user){
                    checkParam = true;
                    element.data.forEach(sub_element => {
                        $("#list-data").append(
                            `
                                <li class="h-20 my-3 bg-white shadow-lg hover:bg-zinc-50 dark:bg-zinc-800 rounded-xl" data-aos="fade-right" data-aos-delay="` + index + `">
                                    <a href="` + sub_element.url + `" target="_blank">
                                        <div class="flex items-center p-4">
                                            <img src="./assets/img/` + sub_element.icon + `.png" alt="" class="h-12">
                                            <div class="flex-grow px-8">
                                                <div class="text-xl font-bold capitalize">` + sub_element.key + `</div>
                                                <div class="text-base italic">` + sub_element.value + `</div>
                                            </div>
                                            <div><i class="fa fa-chevron-right"></i></div>
                                        </div>
                                    </a>
                                </li>
                            `
                        );
                        index += 100;
                    });
                }
            });
        }
        if(!checkParam) {
            $("#list-data").append(`<div class"text-center">Không có thông tin</div>`);
        }
    }
    
    GetData()
    function GetData(){
        $("#list-data").empty();
        var jsonUrl = "../src/assets/database/data.json";
        $.ajax({
            url: jsonUrl,
            dataType: "json",
            async: false,
            success: bindingData
        });
    }
});