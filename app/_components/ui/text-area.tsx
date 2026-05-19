interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
}

export const TextArea = ({ id, ...props }: TextAreaProps) => {
  return <textarea id={id} {...props} />;
};

export default TextArea;
