this.Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");

Meteor.methods({
	addDoc:function(){
		var doc;
		if (!this.userId) {
			return;
		}
		else {
			doc = {owner:this.userId, createdOn:new Date(),
						title:"my new doc"};
			var id = Documents.insert(doc);
			console.log("id :" + id);
			return id;
		}
	},
	addEditingUser:function(docId){
	
		var doc, user, eusers;
		doc = Documents.findOne({_id:docId});
	
		if (!doc){return;}

		if (!this.userId){return;}
	
		user = Meteor.user().profile;
		
		eusers = EditingUsers.findOne({docid:doc._id});
		console.log(eusers);
		
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

