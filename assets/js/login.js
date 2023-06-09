$(function () {
    // 点击“注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“登录”的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 form 对象
    let form = layui.form
    let layer = layui.layer
    // 通过 form.verify() 函数自定义检验规则
    form.verify({
        // 自定义了一个校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须为6到12位，且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致!'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功！')
            // 模拟人的点击行为
            $('#link_login').click()
        })

        // 监听登陆表单的提交事件
        $('#form_login').submit(function (e) {
            // 阻止默认的提交行为
            e.preventDefault()
            // 
            $.ajax({
                url: '/api/login',
                method: 'POST',
                // 快速获取表单中的数据
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('登录失败！')
                    }
                    layer.msg('登陆成功！')
                    // 将登陆成功后得到的 token 字符串，保存到 localStorage 中
                    localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                    location.href = '/index.html'
                }
            })
        })
    })
})