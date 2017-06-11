Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");

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
					Meteor.call("updateContent", cm_editor.getValue(), Session.get("docid"));
					updateContent();
					Meteor.call("addEditingUser", Session.get("docid"));
			});
		}
	}
});

Template.editingUsers.helpers({
  users:function(){
		var doc, eusers, users;
		doc = Documents.findOne();
		if (!doc) {return;}
		eusers = EditingUsers.findOne({docid:Session.get("docid")});
		
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
	"click .js-load-doc":function(event){
		Session.set("docid", this._id);
	},
	"click .js-add-doc":function(event){
		event.preventDefault();
		if (!Meteor.user()){
			alert("You need to login first.")		
		}
		else{
			var id = Meteor.call("addDoc", function(err, res){
				if (!err) {
					console.log("Callback received, id: " + res);
					Session.set("docid", res);
				}
			});
		}
	}
});

Template.navbar.helpers({
  documents:function(){
		return Documents.find();
	}
});

Template.docMeta.helpers({
  document:function(){
		return Documents.findOne({_id:Session.get("docid")});
	},
	canEdit:function(){
		var doc = Documents.findOne({_id:Session.get("docid")});

		if (doc) {
			if (doc.owner == Meteor.userId()) {
					return true;
			}
		}
		
		return false;
	},
	isChecked: function() {
		var doc = Documents.findOne({_id:Session.get("docid")});
		console.log("ischecked")
		if(doc.isPrivate){
			return true
		} 
    return false; 
  }
});

Template.docMeta.events({
	"click .js-tog-private":function(event){
		var doc = {_id:Session.get("docid"), isPrivate:event.target.checked};
		Meteor.call("updateDocPrivacy", doc);
	}
});

Template.editableText.helpers({
	userCanEdit : function(doc, Collection){
		doc = Documents.findOne({_id:Session.get("docid"), owner:Meteor.userId()});
		if(doc){
			return true;
		} else {
			return false;
		}
	}
})


var setupCurrentDocument = function() {
	var doc;
	if (!Session.get("docid")) {
		doc = Documents.findOne();
		if (doc) {
			Session.set("docid", doc._id);
			$("#viewer_iframe").contents().find("html").html(doc.content);
		}
	}
};

var updateContent = function() {
	var doc;
	if (!Session.get("docid")) {
		doc = Documents.findOne();
		if (doc) {
			$("#viewer_iframe").contents().find("html").html(doc.content);
		}
	} else {
		doc = Documents.findOne({_id:Session.get("docid")});
		$("#viewer_iframe").contents().find("html").html(doc.content);
	}
};
