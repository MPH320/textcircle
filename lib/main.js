this.Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");

Meteor.methods({
	addEditingUser:function(){
		
		var doc, user, eusers;
		doc = Documents.findOne();
		
		if (!doc){return;}
		if (!this.userId){return;}
		
		user = Meteor.user().profile;
		console.log(user);
		
		eusers = EditingUsers.findOne({docid:doc._id});
		
		if (!eusers) {
			eusers = {
				docid:doc._id,
				users:{},
			};
		}
		user.lastEdit = new Date();
		user.userName = Meteor.user().username;
		eusers.users[this.userId] = user;
		
		
		EditingUsers.upsert({_id:eusers._id}, eusers);
	}
})

