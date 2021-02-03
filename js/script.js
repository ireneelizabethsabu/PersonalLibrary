$(document).ready(function() {
    $('#landing-page').click(function(){
        $('#landing-page').fadeOut('10000');
        $('#main-page').fadeIn('10000');
    });

    let myLibrary = [];    
    let booksRead = 0;
    
    const updateDisplay = () => {
        if(myLibrary.length === 0){
            $(".library").html('<p class="empty-message"> NO BOOKS HERE</p><p class="message empty-message">Click + to ADD</p>');
        }else{
            $(".library").html("");
            myLibrary.map(book => {
                let card = `
                    <div class="col-md-4 col-sm-6 col-12">
                        <div class="card book-card" >
                            <div class="card-body" id="${book.id}">
                                <table class="table table-borderless table-sm">
                                    <thead>
                                        <h3 class="card-title text-center">${book.name}</h3>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-center">Author</td>
                                            <td class="author card-text">${book.author}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">Pages</td>
                                            <td class="total-pages card-text">${book.totPages}</td>
                                                
                                        </tr>
                                        <tr>
                                            <td class="text-center">Completed</td>
                                            <td class="card-text"><span class="pages-read">${book.pagesRead}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="card-btn-grp" >
                                    <button class="btn btn-dark card-btn plus-btn card-btn-border"><i class="fas fa-plus"></i></button>
                                    <button class="btn btn-dark card-btn minus-btn card-btn-border"><i class="fas fa-minus"></i></button>
                                    <button class="btn btn-dark card-btn trash-btn card-btn-border"><i class="fas fa-trash"></i></button>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" ${book.isDone ? 'checked':'unchecked'}> 
                                </div>  
                            </div>
                        </div>
                    </div>`;
                $('.library').append(card);
            });
        }
    }

    const updateHeader = () => {
        $('#total-books').text(myLibrary.length);
        $('#books-completed').text(booksRead);
    }

    const updateAll = () => {
        updateDisplay();
        updateHeader();
    } 

    const saveLocal = () => {
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
        localStorage.setItem("booksRead",booksRead);
    }  

    const addBookToLibrary = (title,author ,pages,read,done) => {
        myLibrary.push({'id': myLibrary.length,'name':title, 'author':author,'totPages':pages,'pagesRead':read,'isDone':done});
        if(done) booksRead = booksRead+1;
        updateAll();
        saveLocal();
    }

    $('.modal').on('hidden.bs.modal', function(e){ 
        $(this).removeData();
        $('form').removeClass('was-validated');
    }) ;

    function formValidator(title,author,pages,read){
        if(title !== "" && author !== "" && pages !== NaN && read !== NaN){
            return true;            
        }else{
            return false;
        }
    }

    $('.modal-add-btn').click(function (e) {
        
        let title = $('#title').val();
        let author = $('#author').val();
        let pages = parseInt($('#tot-pages').val());
        let read = parseInt($('#pages-read').val());
        if(formValidator(title,author,pages,read)){
            let done = (pages === read) ? true : false;
            addBookToLibrary(title,author,pages,read,done);
        } else{
            e.preventDefault();
            e.stopPropagation();
        }  
        $('form').addClass('was-validated');
    }); 
    
    $(document).on('click','.plus-btn',function(){
        let parent = $(this).parent().parent();
        let index  = parent.attr('id');
        if(myLibrary[index]["totPages"] > myLibrary[index]["pagesRead"]){
            myLibrary[index]["pagesRead"] += 1;
            $(parent).find('.pages-read').text(myLibrary[index]["pagesRead"]);
            if(myLibrary[index]["pagesRead"] === myLibrary[index]["totPages"]){
                $(parent).find('.form-check-input').trigger('change');
            }
        }  
        saveLocal();
    });

    $(document).on('click','.minus-btn',function(){
        let parent = $(this).parent().parent();
        let ind  = parent.attr('id');
        if(myLibrary[ind]["pagesRead"] > 0){
            myLibrary[ind]["pagesRead"] -= 1;
            $(parent).find('.pages-read').text(myLibrary[ind]["pagesRead"]);
            if(myLibrary[ind]["pagesRead"] + 1 === myLibrary[ind]["totPages"]){
                $(parent).find('.form-check-input').trigger('change');               
            }
        }
        saveLocal();
    });
    $(document).on('click','.trash-btn',function(e){
        let index = $(this).parent().parent();
        for(let i=0;i<myLibrary.length;i++){
            if(myLibrary[i]["id"] == index.attr('id')){
                if(myLibrary[i]["pagesRead"] === myLibrary[i]["totPages"])
                    booksRead -= 1;
                myLibrary.splice(i,1);
                break;
            }        
        }
        updateAll();
        saveLocal();
    });

    $(document).on('change','input:checkbox',function(){
        let index = $(this).parent().parent().attr('id');
        myLibrary[index]["isDone"] = !myLibrary[index]["isDone"];
        if(myLibrary[index]["isDone"]){
            booksRead += 1;
            myLibrary[index]["pagesRead"] = myLibrary[index]["totPages"];
        }else if(myLibrary[index]["pagesRead"]===myLibrary[index]["totPages"]){
            myLibrary[index]["pagesRead"] = 0;
            booksRead -= 1;
        }else{
            booksRead -= 1;
        }
        updateAll();
        saveLocal();
    });

    const restoreLocal = () => {
        myLibrary = JSON.parse(localStorage.getItem("myLibrary") || "[]");
        booksRead = localStorage.getItem("booksRead") || 0;
        booksRead = parseInt(booksRead);
        updateAll();
    }
    restoreLocal();
});

