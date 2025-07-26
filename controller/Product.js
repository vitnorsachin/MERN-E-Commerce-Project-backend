import Product from "../model/Product.js";


export const createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const doc = await product.save(); // save data to database
    res.status(201).json(doc); // status(201) for resource creation
  } catch (err) {
    console.error({ err });
    res.status(400).json(err);
  }
};


export const fetchAllProducts = async (req, res) => {
  let query = Product.find({}); // find data from database

  if (req.query.category) {
    // find(filter) = {"category":["smarphone"]}
    query = query.find({ category: req.query.category });
  }

  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
  }

  // TODO : How to get sort on discounted Price not on Actual Price
  if (req.query._sort && req.query._order) {
    // sort = { [_sort:"price"]: req.query._order }
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await query.clone().countDocuments();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    // pagination = {_page=4&_limit=9}
    const page = req.query._page;
    const pageSize = req.query._limit;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const doc = await query.exec(); // fetch data from database
    res.set("X-Total-Count", totalDocs);
    res.status(200).json({ items: totalDocs, data: doc });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};


export const fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id); // find product by Id
    res.status(200).json(product); /// status(200) mean Ok
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};


export const updateProduct = async (req, res) => {
  const {id} = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true});
    res.status(200).json(product);
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
}