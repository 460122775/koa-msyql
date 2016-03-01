var path = require('path');
var Admin = require('../modal/admin');
var qiniu = require('../controllers/qiniu');
var comm = require('../controllers/comm');
var users = require('../controllers/users');
var cards = require('../controllers/cards');
var dict = require('../controllers/dict');
var admin = require('../controllers/admin');
var ue = require('../controllers/ueditor');
var notice = require('../controllers/notice');
var Util = require('../controllers/util');
var _ = require('underscore');
module.exports = function(router,app){
    router.use('/*',function *(next){  //当没有配置的路由
        if(!this.cookies || !this.cookies.get('im') || !this.cookies.get('username')){
            this.redirect('/');
            this.redirect('/loginOut');
            return;
        }else{
            console.log('username '+this.session.username+ ' id '+this.session.id);
            var username = this.cookies.get('username');
            var tokenNm = this.cookies.get('im');
            var ip = this.ip;
            var token = Util.decrypt(tokenNm,ip);
            var admin = yield Admin.findOne({
                where :{username :username,token :token}
            });
            if(admin){
                this.session.username = admin.username;
                this.session.isSuper = admin.isSuper;
                this.session.id = admin.id;
                yield next;
            }else{
                this.redirect('back','../views/login.ejs');
                this.redirect('/loginOut');
                return;
            }
        }
    });

    //admin 配置
    router.get('/admin/modify',admin['modify']);
    router.post('/admin/add/admin',admin['add_post']);
    router.post('/admin/changePwd/admin',admin['update_password']);
    //comm 配置
    router.get('/login',comm['login']);
    router.get('/index',comm['index']);
    router.get('/list/:modal/:back',comm['list']);
    router.get('/edit/:modal/:id/:back',comm['edit']);
    router.get('/add/:modal',comm['add']);
    router.get('/qiniu/getUpToken/:buckName',qiniu['get_qiniu_token']);
    router.get('/search/:modal',comm['search']);
    router.get('/loginOut',comm['loginOut']);
    router.get('/back/:modal/:type',comm['back']);
    router.get('/back_detail/:modal/:type',comm['back_detail']);

    router.post('/login_post',comm['login_post']);
    router.post('/list/:modal',comm['list_post']);
    router.post('/publish/:modal/:type',comm['publish']);
    router.post('/edit/:modal',comm['edit_post']);
    router.post('/add/:modal',comm['add_post']);
    router.post('/search/:modal/:pageSize/:pageNo',comm['search_post']);
    router.post('/delete/:modal',comm['delete_post']);

    //users 配置

    router.get('/users/edit/:id/:back',users['edit']);
    router.get('/users/getSubUser/:id',users['getSubUser']);
    router.get('/users/view/match/:id/:type',users['match']);
    router.get('/users/match_other/:id/:pageSize/:pageNo',users['match_other']);
    router.get('/users/findFriend/:id',users['findFriendById']);
    router.get('/users/findUserById/:id',users['findUsersById']);
    router.get('/users/matched/:id',users['matched']);
    router.get('/users/del_friends/:id',users['del_friends']);
    router.get('/users/bat_add_get/users',users['bat_add_get']);
    router.get('/users/get_dict',users['get_dict']);

    router.post('/users/batch',users['batch']);
    router.post('/users/add/users',users['add_post']);
    router.post('/users/delete',users['del']);
    router.post('/users/match_user',users['match_user']);
    router.post('/users/pub_isClose',users['pub_isClose']);
    router.post('/users/validate_only/:type',users['validate_only']);
    router.post('/users/add_friend',users['add_friend']);
    router.post('/users/match_sys_user',users['match_sys_user']);
    router.post('/users/reset',users['reset']);

    //cards配置
    router.get('/cards/detail/:modal/:id/:back',cards['detail']);
    router.get('/cards/cardDetail/:id/:back',cards['cardDetail']);
    router.get('/cards/noteList/:id/:pageSize/:pageNo',cards['noteList']);
    router.get('/cards/del_note/:id',cards['del_note']);
    router.get('/cards/delete_report/:id',cards['delete_report']);

    router.post('/cards/add/cards',cards['add']);
    router.post('/cards/like',cards['like']);
    router.post('/cards/delete',cards['delete']);
    router.post('/cards/batch_del',cards['batch_del']);
    router.post('/cards/batch_add',cards['batch_add']);
    router.post('/cards/addNote',cards['addNote']);


    //dict配置
    router.get('/dict/release',dict['release']);
    router.post('/dict/validate_key/:modal',dict['validate_key']);
    router.post('/dict/validate_value_insert/:modal',dict['validate_value_insert']);
    router.post('/dict/add_dict/:modal',dict['add_dict']);
    router.post('/dict/edit_dict/:modal',dict['edit_dict']);
    router.post('/dict/delete_dic/:modal',dict['delete_dic']);

    router.get('/ueditor/ue',ue['ue_up']);
    router.post('/ueditor/ue',ue['ue_up']);

    router.get('/notice/edit/:id/:back',notice['edit']);
    router.get('/notice/:id',notice['get_notice']);
    router.post('/notice/add_notice/notice',notice['add_notice']);
    router.post('/notice/send',notice['send']);
    router.post('/notice/edit_notice/notice',notice['edit_post']);


};
