import './index.css';
import { Message } from '@chatapp/message';
import { Loading } from '@chatapp/loading';
import { useChatLogic } from '@chatapp/usechat';

export const Chat = () => {
  const { messages, loading, handleSubmit, inputRef } = useChatLogic();

  return (
    <section className="chat">
      <h1 className="chat__title">TechNova Chat</h1>

      <section className="chat__messages">
        {messages.map((message, index) => (
          <div key={index} className="chat__message-row">
            <Message text={message.text} role={message.role} />

            {/* our RAG badge — only for assistant, only if we have sources */}
            {message.role !== 'user' &&
              Array.isArray(message.sources) &&
              message.sources.length > 0 && (
                <div className="chat__source-pill">Source: TechNova FAQ</div>
              )}
          </div>
        ))}

        {loading && <Loading />}
      </section>

      <form className="chat__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat__input"
          ref={inputRef}
          placeholder="Write a message and press Enter..."
        />
        <button className="chat__btn" type="submit" disabled={loading}>
          Skicka!
        </button>
      </form>
    </section>
  );
};
