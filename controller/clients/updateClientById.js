const clientModel = require("../../models/clients");

async function updateClientById(req, res) {
  try {
    const { name, metadata, categories, SPLs } = req.body;

    const client = await clientModel.findOne({
      userID: req.userId,
      _id: req.params.clientID,
    });

    if (name) {
      // Check for client name duplication
      const _duplicate = await clientModel.findOne({
        userID: req.userId,
        name: name,
        _id:{$ne:req.params.clientID}
      });
      if (_duplicate ) {
        throw new Error("Client name duplication");
      }
      client.name = name;
    }

    if (metadata) {
      client.metadata = metadata;
    }

    let _temp = [];

    if (categories) {
      // client.categories=categories
      for (const category of categories) {
        if (category._id) {
          if (category.delete) {
            _temp.push(category._id);
          } else {
            for (const _category of client.categories) {
              if (category._id === _category._id.toString()) {
                if (category.metadata) {
                  _category.metadata = category.metadata;
                }
                if (category.name) {
                  _category.name = category.name;
                }

                console.log("[+]Update category match found", category);
              }
            }
          }
        } else {
          if (!client.categories.some((cat) => cat.name === category.name)) {
            client.categories.push({
              name: category.name,
              metadata: category.metadata ? category.metadata : "",
            });
          }
        }
      }
      if (_temp.length > 0) {
        // console.log('[+]Marked for delete ',_temp)
        client.categories = client.categories.filter((e) =>
          !_temp.includes(e._id.toString())
        );
        // console.log('[+]Marked for delete ',_temp)

        _temp = [];
      }
    }

    if (SPLs) {
      // Update client.SPLs based on SPLs
      for (const SPL of SPLs) {
        if (SPL._id) {
          if (SPL.delete) {
            _temp.push(SPL._id);
          } else {
            for (const _SPLs of client.SPLs) {
              if (SPL._id === _SPLs._id.toString()) {
                if (SPL.name) {
                  _SPLs.name = SPL.name;
                }
              }
            }
          }
        } else {
          if (!client.SPLs.some((spl) => spl.name === SPL.name)) {
            client.SPLs.push({ name: SPL.name });
          }
        }
      }
      if(_temp.length>0){
        client.SPLs=client.SPLs.filter((e)=> !_temp.includes(e._id.toString()));
        _temp=[]
      }
    }

    const updatedClient = await client.save();
    console.log(updatedClient);
    return res.json({
      error: false,
      data: updatedClient,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

module.exports = updateClientById;
