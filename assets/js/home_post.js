{
    let createPost = ()=>{
        let newPostForm = $('#new-post-form');

        newPostForm.submit((event)=>{
            event.preventDefault();

            $.ajax({
                type :'post',
                url :'/posts/create',
                data : newPostForm.serialize(),
                success:function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-btn', newPost));
                    $('#new-post-form>textarea').val("");
                    new PostComments(data.data.post._id);
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })
        });
    }
    //method to create a post in DOM
    let newPostDom = function(post){
        return $(`
        <li id="post-${post._id}">
            ${post.content}
            <br>
            <small>
                ${post.user.name}
            </small>
            <a class ="delete-post-btn" href="/posts/destroy/${post._id}">X</a>
            <div class="post-comments">
                    <form id="post-<%= post._id %>-comments-form" action="/comments/create" method="POST">
                        <input type="text" name="content" placeholder="Type comments here" required>
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Add Comment">
                    </form>
                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                        </ul> 
                    </div>
            </div>
        </li>`);
    }

    //method to delete post from DOM
    let deletePost = (deleteLink)=>{
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: (data)=>{
                    // console.log(data.data.post_id);
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error: (error)=>{
                    console.log(error.responseText);
                }
            });
        })

    }
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}