import LiveStream from '../models/LiveStream.js';

export const getActive = async (req, res) => {
  const lives = await LiveStream.find({ status: 'live' }).populate('userId', 'name photo');
  res.json(lives);
};

export const comment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const live = await LiveStream.findById(id);
  if (!live || live.status !== 'live') return res.status(404).json({ message: 'Not live' });
  live.comments.push({ userId: req.user._id, text });
  await live.save();
  res.json(live.comments);
};

export const getComments = async (req, res) => {
  const { id } = req.params;
  const live = await LiveStream.findById(id).populate('comments.userId', 'name photo');
  if (!live) return res.status(404).json({ message: 'Not found' });
  res.json(live.comments);
};

export const approveLive = async (req, res) => {
  const { id } = req.params;
  const live = await LiveStream.findById(id);
  if (!live || live.status !== 'pending') return res.status(404).json({ message: 'Not found or not pending' });
  live.status = 'approved';
  await live.save();
  res.json(live);
};

export const rejectLive = async (req, res) => {
  const { id } = req.params;
  const live = await LiveStream.findById(id);
  if (!live || live.status !== 'pending') return res.status(404).json({ message: 'Not found or not pending' });
  live.status = 'rejected';
  await live.save();
  res.json(live);
}; 