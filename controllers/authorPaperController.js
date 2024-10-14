// const AuthorPaper = require('../models/authorPaperModel.js');
// const Paper = require('../models/paperModel.js');

// exports.getPapersByAuthorId = async (req, res) => {
//   try {
//     const { authorId } = req.params;

//     // Lấy danh sách paper IDs từ bảng authors_papers theo author_id
//     const authorPapers = await AuthorPaper.findAll({
//       where: { id_authors: authorId },
//       attributes: ['id_papers'], // Lấy ra id_papers từ bảng authorpaper
//     });

//     const paperIds = authorPapers.map((ap) => ap.id_papers);

//     // Lấy tất cả các bài báo từ bảng papers theo danh sách paperIds
//     const papers = await Paper.findAll({
//       where: {
//         id: paperIds,
//       },
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         papers,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to fetch papers by author ID',
//     });
//   }
// };

const AuthorPaper = require('../models/authorPaperModel.js');
const Paper = require('../models/paperModel.js');
const Author = require('../models/authorModel.js');

exports.getPapersByAuthorId = async (req, res) => {
  try {
    const { authorId } = req.params;

    // Lấy danh sách paper IDs từ bảng authors_papers theo author_id
    const authorPapers = await AuthorPaper.findAll({
      where: { id_authors: authorId },
      attributes: ['id_papers', 'num_of_gifts'], // Lấy ra id_papers và num_of_gifts từ bảng authorPaper
    });

    const paperIds = authorPapers.map((ap) => ap.id_papers);

    // Lấy tất cả các bài báo từ bảng papers theo danh sách paperIds
    const papers = await Paper.findAll({
      where: {
        id: paperIds,
      },
    });

    // Lấy tất cả các bản ghi authorPaper liên quan đến những bài báo này
    const allAuthorPapers = await AuthorPaper.findAll({
      where: {
        id_papers: paperIds,
      },
      attributes: ['id_papers', 'num_of_gifts'], // Lấy id_papers và num_of_gifts cho từng tác giả
    });

    // Tính toán số lượng quà còn lại cho mỗi bài báo
    const result = papers.map((paper) => {
      // Tính tổng số quà đã lấy cho bài báo này
      const totalGiftsTaken = allAuthorPapers
        .filter((ap) => ap.id_papers === paper.id)
        .reduce((sum, ap) => sum + ap.num_of_gifts, 0);

      // Lấy số quà của tác giả hiện tại
      const authorPaperEntry = authorPapers.find(
        (ap) => ap.id_papers === paper.id,
      );
      const numOfGifts = authorPaperEntry ? authorPaperEntry.num_of_gifts : 0;

      // Số quà còn lại cho bài báo này
      const remainingGifts = paper.num_of_registers - totalGiftsTaken;

      return {
        id: paper.id,
        title: paper.title,
        track_name: paper.track_name,
        track_id: paper.track_id,
        published_time: paper.published_time,
        num_of_registers: paper.num_of_registers,
        num_of_gifts: numOfGifts,
        remaining_gifts: remainingGifts,
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        papers: result,
      },
    });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch papers by author ID',
    });
  }
};

exports.updateGiftsForPaper = async (req, res) => {
  try {
    const { authorId, paperId } = req.params;
    const { numOfGifts } = req.body; // Số lượng quà đã lấy từ request body

    // Kiểm tra numOfGifts có tồn tại trong request body
    if (numOfGifts === null || numOfGifts === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'numOfGifts is required.',
      });
    }

    // Kiểm tra sự tồn tại của bản ghi trước khi cập nhật
    const authorPaper = await AuthorPaper.findOne({
      where: {
        id_authors: authorId,
        id_papers: paperId,
      },
    });

    if (!authorPaper) {
      return res.status(404).json({
        status: 'error',
        message: 'No record found for the specified author and paper.',
      });
    }

    // Cập nhật số lượng quà trong bảng authors_papers
    authorPaper.num_of_gifts = numOfGifts;
    await authorPaper.save();

    res.status(200).json({
      status: 'success',
      message: 'Number of gifts updated successfully.',
      data: {
        authorId,
        paperId,
        numOfGifts,
      },
    });
  } catch (err) {
    console.error(err); // Log lỗi để giúp việc gỡ lỗi
    res.status(500).json({
      status: 'error',
      message: 'Failed to update number of gifts.',
    });
  }
};

exports.getAuthorsWithGiftsForPaper = async (req, res) => {
  try {
    const { paperId } = req.params;

    const authorsWithGifts = await AuthorPaper.findAll({
      where: { id_papers: paperId }, // Chỉ định bài báo cụ thể
      attributes: [
        'id',
        'id_authors',
        'name_authors',
        'affiliation_authors',
        'id_papers',
        'is_registered',
        'paid',
        'num_of_gifts',
      ],
      include: [
        {
          model: Author,
          attributes: [
            'id',
            'author_name',
            'affiliation',
            'email',
            'author_role',
            'checked_in',
          ], // Lấy thông tin cần thiết của tác giả
        },
        {
          model: Paper,
          attributes: ['id', 'title'], // Lấy thông tin cần thiết của bài báo
        },
      ],
    });

    // const result = authorsWithGifts.map((authorPaper) => {
    //   const authorWithGift = authorPaper.toJSON();
    //   authorWithGift.Author.num_of_gifts = authorPaper.num_of_gifts;
    //   return authorWithGift;
    // });

    res.status(200).json({
      status: 'success',
      message: 'Authors with gifts retrieved successfully.',
      data: {
        authorsWithGifts,
      },
    });
  } catch (err) {
    console.error(err); // Log lỗi để giúp việc gỡ lỗi
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve authors with gifts.',
    });
  }
};
