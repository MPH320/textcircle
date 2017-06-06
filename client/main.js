Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});

Template.editor.helpers({
  docid:function(){
		setupCurrentDocument();
		return Session.get("docid")
	},
	config:function(){
		return function(editor){
				editor.setOption("lineNumbers", true);
				editor.setOption("theme", "twilight");
				editor.on("change", function(cm_editor, info){
			
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
			
			users[i] = eusers.users[user_id];
			
			i++;
		}
		return users;
	}
});

Template.navbar.events({
	"click .js-add-doc":function(event){
		event.preventDefault();
		console.log("add new doc");
		if (!Meteor.user()){
			alert("You need to login first.")		
		}
		else{
			var id = Meteor.call("addDoc", function(err, res){
				if (!err) {
					console.log("Callback received, id: " + res);
					Session.set("docid", res)
				}
			});
		}
	}
});


var setupCurrentDocument = function() {
	var doc;
	if (!Session.get("docid")) {
		doc = Documents.findOne();
		if (doc) {
			Session.set("docid", doc._id);
		}
	}
};
