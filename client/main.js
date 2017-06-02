Template.editor.helpers({
  docid:function(){
		return Documents.findOne()._id;
	},
	config:function(){
		return function(editor){
			editor.on("change", function(cm_editor, info){
				console.log(cm_editor.getValue());
				$("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
				Meteor.call("addEditingUser")
			});
		}
	}
});

Template.editingUsers.helpers({
  users:function(){
		var doc, eusers, users;
		doc = Documents.findOne();
		if (!doc) {return;}
		eusers = EditingUsers.findOne({docid:doc._id});
		if (!eusers) {return;}
		users = new Array();
		var i = 0;
		for (var user_id in eusers.users) {
			console.log(eusers.users[user_id]);
			users[i] = fixObjectKeys(eusers.users[user_id]);
			i++;
		}
		return users;
	}
});

var fixObjectKeys = function(obj) {
	var newObj = {};
	for (key in obj) {
		var key2 = key.replace("-", "");
		newObj[key2] = obj[key];
	}
	return newObj;
}