import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  if(!Documents.findOne()){
			 Documents.insert({title:"my new document"});
		}
});
