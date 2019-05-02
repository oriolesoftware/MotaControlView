let util = {

};
util.title = function (title) {
    title = title ? title + ' - MOTA System(Client)' : 'MOTA System(Client)';
    window.document.title = title;
};

export default util;