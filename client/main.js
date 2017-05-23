Meteor.setInterval(function(){
	Session.set("current_date", new Date());
}, 1000);

Template.editor.helpers({
  docid:function(){
		return Documents.findOne()._id;
	}
});

Template.date_display.helpers({
  "current_date":function(){
		return Session.get("current_date");
	}
});

