this.Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");

Meteor.methods({
	addEditingUser:function(){
		
		var doc, user, eusers;
		doc = Documents.findOne();
		
		if (!doc){return;}
		if (!this.userId){return;}
		
		user = Meteor.user().profile;
		
		eusers = EditingUsers.findOne({docid:doc._id});
		
		if (!eusers) {
			eusers = {
				docid:doc._id,
				users:{},
			};
		}
		user.lastEdit = new Date();
		eusers.users[this.userId] = user;
		
		EditingUsers.upsert({_id:eusers._id}, eusers);
	}
})