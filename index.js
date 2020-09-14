function escape(toOutput){
    return toOutput.replace(/\&/g, '&amp;')
      .replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#x27')
      .replace(/\//g, '&#x2F');
    }

    function addNewTask(newTask, taskDOM) {
      const html = `
      <li class="list-group-item unchecked">
        <div class="list__body">
          <div class="list__checkbox"></div>
          <div class="list__text">${escape(newTask)}</div>
          <input type="text" class="list__edit form-control hide" name="edit" />
        </div>
        <div class="list__delete">X</div>
      </li>
      `
      taskDOM.append(html)
    }

    $(document).ready(() => {
      let params = new URL(document.location).searchParams
      let id = params.get('id')

      if(id !== null) {
        $.ajax({
          type: 'GET',
          url: `./api_load_todos.php?id=${id}`
        }).done(function(data) {
          if(!data.ok) {
            alert(data.message)
            return
          }
          const todos = JSON.parse(data.content)
          $('.list-group').html(todos)
        })
      }

      /*新增task*/
      $('.addList__form').submit(e => {
        e.preventDefault()
        const newTask = $('input[name=task]').val()
        const taskDOM = $('.list-group')
        addNewTask(newTask, taskDOM)
        $('input[name=task]').val('')
      })

      /*刪除task*/
      $('.list-group').on('click', '.list__delete', (e) => {
        $(e.target).parent().remove()
      })

      /*編輯task*/
      $('.list-group').on('dblclick', '.list__text', (e) => {
        let str = $(e.target).html()
        console.log(str)
        $(e.target).addClass('hide')
        $(e.target).parent().children('.list__edit').removeClass('hide')
        $(e.target).parent().children('.list__edit').addClass('edit')
        $('input[name=edit]').val(str).focus()
      })

      $('.list-group').on('blur', '.edit', (e) => {
        console.log(e.target)
        e.preventDefault()
        let newStr = $(e.target).val()
        console.log(newStr)
        $(e.target).parent().children('.list__text').removeClass('hide')
        $(e.target).parent().children('.list__text').html(newStr)
        $(e.target).addClass('hide')
        $(e.target).removeClass('edit')
      })

      /*標記完成or未完成*/
      $('.list-group').on('click', '.list__checkbox', (e) => {
        $(e.target).parent().parent().toggleClass('checked')
        $(e.target).parent().parent().toggleClass('unchecked')
      })

      /*清空task*/
      $('.btn-clearAll').click(e => {
        $('.list-group').html('')
      })

      /*篩選task*/
      $('.nav__all').click(e => {
        e.preventDefault()
        if($('.nav__all a').hasClass('active')) {
          return
        }
        $(e.target).addClass('active')
        $(e.target).parent().parent().children('.nav__task').children('a').removeClass('active')
        $(e.target).parent().parent().children('.nav__completed').children('a').removeClass('active')
        $('.list-group').find('.checked').removeClass('hide')
        $('.list-group').find('.unchecked').removeClass('hide')
      })

      $('.nav__task').click(e => {
        e.preventDefault()
        if($('.nav__task a').hasClass('active')) {
          return
        }
        $(e.target).addClass('active')
        $(e.target).parent().parent().children('.nav__all').children('a').removeClass('active')
        $(e.target).parent().parent().children('.nav__completed').children('a').removeClass('active')
        $('.list-group').find('.checked').addClass('hide')
        $('.list-group').find('.unchecked').removeClass('hide')
      })

      $('.nav__completed').click(e => {
        e.preventDefault()
        if($('.nav__completed a').hasClass('active')) {
          return
        }
        $(e.target).addClass('active')
        $(e.target).parent().parent().children('.nav__task').children('a').removeClass('active')
        $(e.target).parent().parent().children('.nav__all').children('a').removeClass('active')
        $('.list-group').find('.unchecked').addClass('hide')
        $('.list-group').find('.checked').removeClass('hide')
      })

      /*儲存todos*/
      $('.btn-saveData').click(e => {
        const content = JSON.stringify($('.list-group').html())
        if(id !== null) {
          $.ajax({
            type: 'POST',
            url: './api_save_todos.php',
            data: {
              "id": id,
              "content": content
            }
          }).done(function(data) {
            if(!data.ok) {
              alert(data.message)
              return
            }
            if(data.id) {
              alert(`
              儲存成功！ 再次提醒您的id為${data.id}
              下次只要在網址列最後帶上 ?id=${data.id} 便可看見您的todos摟！
              `)
            }
          })
        } else {
          $.ajax({
            type: 'POST',
            url: './api_save_todos.php',
            data: {
              "content": content
            }
          }).done(function(data) {
            if(!data.ok) {
              alert(data.message)
              return
            }
            if(data.id) {
              alert(`
              儲存成功！ 您的id為${data.id}
              下次只要在網址列最後帶上 ?id=${data.id} 便可看見您的todos摟！
              `)
            }
          })
        }
      })
    })