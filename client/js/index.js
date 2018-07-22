/***
 * author: Tushar Bochare
 * Email: mytusshar@gmail.com
 */

$(document).ready(function() {
    var notiTabOpened = false;
    var socket = io();
    var notViewedCount = 0;
    var unreadCount = 0;
    var mostRecentNotiId = 0;
    var notViewedCountWhenOpened = 0;

    $('#noti-tab').click(notiTabClickAction);
    $(document).click(docClickAction);
    $('.noti-container').click(notiContainerClickAction);
    $('.noti-body').on('click', 'li.noti-text', notiBodyTextClickAction);
    socket.on('newNotificationAdded', onNewNotiCB);

    function onNewNotiCB(noti) {
        addNotiItem(noti);
        unreadCount++;
        notViewedCount++;
        setNotViewedCount();
        setUnreadCount();
    }

    var addNotiItem = function(noti) {
        var childItem = $('<li>').attr({
                            'data-notiid': noti.notiId,
                            'class': 'noti-text'
                        }).append("ABC commented on " + noti.notiData);
        if(!noti.unread) {
            $(childItem).addClass('has-read');
        }
        childItem = Array.prototype.slice.call(childItem);
        $('.noti-body').prepend(childItem);
        mostRecentNotiId = noti.notiId;
    }

    var setUnreadCount = function() {
        if(notiTabOpened) {
            $('#noti-container-count').html(unreadCount);
            $('.noti-title').css('display', 'inline-block');
        }
    }

    var setNotViewedCount = function() {
        if(!notiTabOpened && notViewedCount > 0) {
            $('#navi-noti-count').html(notViewedCount);
            $('#navi-noti-count').css('display', 'inline-block');
        } else {
            notViewedCount = 0;
            notViewedCountWhenOpened++;
        }
    }

    function notiTabClickAction(evt) {
        evt.stopPropagation();
         if(notiTabOpened) {
            updateNotificationView(mostRecentNotiId, notViewedCountWhenOpened);
        } else {
            updateNotificationView(mostRecentNotiId, notViewedCount);
        }
        notiTabOpened = notiTabOpened ? false : true;
        if(unreadCount) {
            $('#navi-noti-count').fadeOut('slow');
            $('.noti-title').css('display', 'inline-block');
        }
        $('.noti-container').slideToggle(400);
    }

    function docClickAction() {
        $('.noti-container').hide();
        if(notiTabOpened) {
            notiTabOpened = false;
            updateNotificationView(mostRecentNotiId, notViewedCountWhenOpened);
        }
    }

    function notiContainerClickAction(evt) {
        evt.stopPropagation();
        return false;
    }

    function notiBodyTextClickAction(evt) {
        evt.stopPropagation();
        if(! ($(evt.currentTarget).hasClass('has-read')) ) {
            updateNotificationCount(evt.currentTarget);
        }
    }

    var getNotifications = function() {
        $.ajax({
            url : "http://localhost:8000/notifications",
            type : 'GET',
            dataType : 'json',
            success : function(notiList) {
                for(var i=0; i<notiList.length; i++) {
                    addNotiItem(notiList[i]);
                }

                unreadCount = (_.filter(notiList, function(noti) {
                    return noti.unread == 1;
                })).length;

                notViewedCount = (_.filter(notiList, function(noti) {
                    return noti.viewed == 1;
                })).length;
                setUnreadCount();
                setNotViewedCount();
            }
        });
    }

    var updateNotificationCount = function(currentTarget) {
        var notiId = $(currentTarget).data('notiid');
        $.ajax({
            url : "http://localhost:8000/notifications/unread",
            type : 'PUT',
            data : JSON.stringify({notiId: notiId}),
            contentType : 'application/json',
            success : function() {
                unreadCount--;
                if(unreadCount == 0) {
                    $('.noti-title').hide();
                } else {
                    $('#noti-container-count').html(unreadCount);
                }
                $(currentTarget).addClass('has-read');
            }
        });
    }

    var updateNotificationView = function(recentNoti, count) {
        $.ajax({
            url : "http://localhost:8000/notifications/viewed",
            type : 'PUT',
            data : JSON.stringify({recentNoti: recentNoti, count: count}),
            contentType : 'application/json',
            success : function() {
                notViewedCount = 0;
                notViewedCountWhenOpened = 0;
                if(unreadCount == 0) {
                    $('.noti-title').hide();
                } else {
                    $('#noti-container-count').html(unreadCount);
                }
            }
        });
    }

    getNotifications();
});
