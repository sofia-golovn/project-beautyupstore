import { useState, useEffect } from "react";
import { Upload, Loader, PlusCircle, Trash2, Image as ImageIcon } from "lucide-react";
import { useCategoryStore } from "../stores/useCategoryStore";
import { toast } from "react-hot-toast";

const CreateCategory = () => {
	const [name, setName] = useState("");
	const [image, setImage] = useState(null);
	
	const { createCategory, fetchCategories, deleteCategory, categories, loading } = useCategoryStore();

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("File is too large. Max size is 5MB.");
				e.target.value = null;
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => setImage(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!image) return toast.error("Please upload an image");
		try {
			await createCategory({ name, image });
			setName("");
			setImage(null);
		} catch (error) {
			console.log("Error creating category", error);
		}
	};

	return (
		<div className='max-w-4xl mx-auto p-4'>
			<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-12'>
				<h2 className='text-xl font-semibold mb-6 text-[#74090A] tracking-wider uppercase text-center'>
                    Create New Category
                </h2>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>Category Name</label>
						<input
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md 
							focus:ring-1 focus:ring-[#74090A] outline-none'
							placeholder='e.g. Face'
							autoComplete='off'
							required
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>Category Image</label>
						<div className='flex flex-col gap-2'>
							<label className='cursor-pointer flex items-center 
							justify-center gap-2 bg-gray-50 p-4 border-2 border-dashed
							border-gray-300 rounded-md hover:bg-gray-100 transition-colors'>
								<Upload size={18} className='text-[#74090A]' />
								<span className='text-sm text-gray-600 uppercase tracking-tight'>Choose Photo</span>
								<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
							</label>
							<p className='text-[10px] text-gray-400 italic tracking-tight text-center'>
								* Images must be under 5MB (JPEG, PNG).
							</p>
						</div>
						{image && <div className='mt-2 text-xs text-green-600 font-medium text-center'>✓ Image selected</div>}
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full bg-[#74090A] text-white py-2.5 rounded-md 
						hover:bg-[#4F0608] transition-colors flex items-center justify-center 
						gap-2 disabled:opacity-50'
					>
						{loading ? <Loader className='animate-spin' size={18} /> : <PlusCircle size={18} />}
						{loading ? "Processing..." : "Create Category"}
					</button>
				</form>
			</div>

			<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
				<h3 className='text-xl font-semibold mb-6 text-[#74090A] tracking-wider uppercase text-center'>
					Existing Categories
				</h3>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.length > 0 ? (
						categories.map((category) => (
							<div key={category._id} className='flex items-center justify-between p-3 
							bg-gray-50 rounded-md border border-gray-200 group'>
								<div className='flex items-center gap-3'>
									{category.imageUrl ? (
										<img src={category.imageUrl} alt={category.name} className='w-10 h-10 
										object-cover rounded shadow-sm' />
									) : (
										<div className='w-10 h-10 bg-gray-200 rounded flex items-center justify-center'>
											<ImageIcon size={16} className='text-gray-400' />
										</div>
									)}
									<span className='text-sm font-medium text-gray-700 capitalize'>{category.name}</span>
								</div>
								
								<button
									onClick={() => {
										if (window.confirm(`Delete "${category.name}" category?`)) {
											deleteCategory(category._id);
										}
									}}
									className='text-gray-400 hover:text-[#74090A] transition-colors p-1'
									title='Delete category'
								>
									<Trash2 size={18} />
								</button>
							</div>
						))
					) : (
							<p className='col-span-full text-center text-gray-400 text-sm italic'>
								No categories created yet.
							</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default CreateCategory;