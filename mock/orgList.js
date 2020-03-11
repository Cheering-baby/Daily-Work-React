const tree = [
  {
    name: 'Hong Tai HQ',
    child: [
      {
        name: 'Hong Tai Orchard',
      },
      {
        name: 'china-suzhou',
      },
      {
        name: 'china-hangzhou',
      },
    ],
  },
  {
    name: 'ken',
    child: [
      {
        name: 'ken-ar',
      },
      {
        name: 'europe',
      },
    ],
  },
];

const api = 'POST /pams/api/orgService';
module.exports = {
  [api](req, res) {
    res.json({ list: tree });
  },
};
