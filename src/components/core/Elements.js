
import React from 'react';
import { useField } from 'formik';

export const NestInput = ({ label, labelClass, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <>
            {props.haslabel && <label htmlFor={props.id || props.name} className={labelClass}></label>}
            <input {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="text-danger">{meta.error}</div>
            ) : null}
        </>
    );
};