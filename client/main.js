Template.editor.helpers({
  docid:function(){
		console.log("Hey");
		return Documents.findOne()._id;
	}
});

