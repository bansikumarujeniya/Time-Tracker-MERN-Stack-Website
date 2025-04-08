import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddProjectForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm();

    // Handle form submission
    const onSubmit = async (data) => {
        const formattedData = {
            title: data.title,
            description: data.description,
            technology: data.technology,
            estimatedHours: data.estimatedHours,
            startDate: data.startDate,
            completionDate: data.completionDate,
            statusId: data.statusId
        };

        try {
            const response = await axios.post('http://localhost:3000/projects/add', formattedData);

            toast.success('Project added successfully!', {
                position: "top-center",
                autoClose: 2000,
            });

            console.log('Response:', response.data);

            setValue('title', '');
            setValue('description', '');
            setValue('technology', '');
            setValue('estimatedHours', '');
            setValue('startDate', '');
            setValue('completionDate', '');
            setValue('statusId', '');
        } catch (error) {
            console.error('Error adding project:', error);

            toast.error('There was an error while adding the project. Please try again.', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    return (
        <main style={styles.main}>
            <div className="app-content-header">
                <h3 className="mb-0" style={styles.heading}>Add Project</h3>
            </div>
            <div className="app-content">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="projectTitle" className="form-label">Project Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="projectTitle"
                                {...register('title', { required: 'Project name is required.' })}
                                style={styles.input}
                            />
                            {errors.title && <small style={styles.error}>{errors.title.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                {...register('description', { required: 'Description is required.' })}
                                style={styles.input}
                            />
                            {errors.description && <small style={styles.error}>{errors.description.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="technology" className="form-label">Technology</label>
                            <input
                                type="text"
                                className="form-control"
                                id="technology"
                                {...register('technology', { required: 'Technology is required.' })}
                                style={styles.input}
                            />
                            {errors.technology && <small style={styles.error}>{errors.technology.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="estimatedHours" className="form-label">Estimated Hours</label>
                            <input
                                type="number"
                                className="form-control"
                                id="estimatedHours"
                                {...register('estimatedHours', { required: 'Estimated hours is required.', min: 0 })}
                                style={styles.input}
                            />
                            {errors.estimatedHours && <small style={styles.error}>{errors.estimatedHours.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="startDate"
                                {...register('startDate', { required: 'Start date is required.' })}
                                style={styles.input}
                            />
                            {errors.startDate && <small style={styles.error}>{errors.startDate.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="completionDate" className="form-label">Completion Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="completionDate"
                                {...register('completionDate', { required: 'End date is required.' })}
                                style={styles.input}
                            />
                            {errors.completionDate && <small style={styles.error}>{errors.completionDate.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="statusId" className="form-label">Status</label>
                            <select className="form-control" id="statusId" {...register('statusId', { required: 'Status is required.' })} style={styles.input}>
                                <option value="">Select Status</option>
                                <option value="67d003e6805518892ba6eaa2">In Progress</option>
                                <option value="67d00431805518892ba6eaa4">Completed</option>
                                <option value="67d0044c805518892ba6eaa6">Pending</option>
                            </select>
                            {errors.statusId && <small style={styles.error}>{errors.statusId.message}</small>}
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn" style={styles.button}>Add Project</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </main>
    );
};

// Internal Styles
const styles = {
    main: {
        backgroundColor: '#AAB99A', 
        padding: '50px',
        margin: '20px', 
        borderRadius: '10px', 
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
    },
    card: {
        backgroundColor: '#AAB99A',
        padding: '20px',
        borderRadius: '10px',
        border: 'none',
        boxShadow: 'none',
    },
    cardHeader: {
        backgroundColor: '#AAB99A',
        borderBottom: 'none',
        color: '#333',
    },
    heading: {
        color: '#5A6E58',
        paddingTop: '10px',
    },
    breadcrumbLink: {
        color: '#5A6E58',
        textDecoration: 'none',
    },
    breadcrumbActive: {
        color: '#5A6E58',
    },
    input: {
        border: '1px solid #5A6E58',
        backgroundColor: '#FFFFFF',
        color: '#333',
        padding: '10px',
        outline: 'none',
        boxShadow: 'none',
    },
    error: {
        color: 'red',
        fontSize: '12px',
    },
    button: {
        backgroundColor: '#D0DDD0',
        borderColor: '#AAB99A',
        color: '#333',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};
