// Eiken Interview Practice — question data + UI logic
console.log("[EikenApp] interview.js loading...");
window._interviewLoaded = false;

const INTERVIEW_DATA={"grade3": [{"id": 1, "topic": "Going to the Library", "passage": "Many students go to the library after school. They can read books, study quietly, and use computers there. Some students borrow books to read at home. Libraries are free to use and open to everyone.", "illustration": "A boy is sitting at a desk in a library. He is reading a book. On the desk, there are two more books and a pencil. A librarian is standing nearby, helping another student.", "questions": [{"q": "According to the passage, what can students do at the library?", "model": "They can read books, study quietly, and use computers.", "keywords": ["read", "books", "study", "computers", "quietly"]}, {"q": "According to the passage, why do some students borrow books?", "model": "Because they want to read them at home.", "keywords": ["home", "read", "borrow"]}, {"q": "Please look at the picture. What is the boy doing?", "model": "He is reading a book at a desk.", "keywords": ["reading", "book", "desk", "sitting"]}, {"q": "Do you often go to the library?", "model": "Yes, I go to the library once a week to study and borrow books. / No, I don't go often, but I sometimes visit to use the computers.", "keywords": ["library", "study", "books", "sometimes", "often"]}, {"q": "Today, many people read books on electronic devices instead of paper books. Do you think this is a good thing?", "model": "Yes, I think it is good because you can carry many books at once and they are easy to read anywhere. / No, I prefer paper books because they are easier on the eyes.", "keywords": ["good", "books", "easy", "carry", "prefer", "eyes", "digital", "electronic"]}]}, {"id": 2, "topic": "School Sports Day", "passage": "Sports day is one of the most popular school events in Japan. Students practise for weeks before the event. They run races, play team games, and cheer for their classmates. Parents often come to watch.", "illustration": "A group of students are running in a race on a school field. Some students are cheering on the side. A teacher is standing at the finish line with a stopwatch.", "questions": [{"q": "According to the passage, how long do students practise before sports day?", "model": "They practise for weeks.", "keywords": ["weeks", "practise", "practice", "before"]}, {"q": "According to the passage, who often comes to watch sports day?", "model": "Parents often come to watch.", "keywords": ["parents", "watch", "come"]}, {"q": "Please look at the picture. What are the students doing?", "model": "Some students are running in a race, and others are cheering.", "keywords": ["running", "race", "cheering", "field"]}, {"q": "Do you enjoy sports day at your school?", "model": "Yes, I enjoy it very much. I like running and cheering for my friends. / No, I am not very good at sports, but I enjoy cheering for my classmates.", "keywords": ["enjoy", "sports", "running", "friends", "cheering", "classmates"]}, {"q": "Some people say children should have more physical exercise at school. Do you agree?", "model": "Yes, I agree because exercise is important for health and it helps students concentrate better in class.", "keywords": ["agree", "exercise", "health", "important", "concentrate", "class", "physical"]}]}, {"id": 3, "topic": "Cooking at Home", "passage": "More young people are learning to cook at home. Cooking is a useful skill for everyday life. People who cook at home can save money and eat healthier food. Some people enjoy cooking as a hobby.", "illustration": "A teenage girl is standing in a kitchen. She is cutting vegetables on a chopping board. There is a pot on the stove. Her mother is watching and smiling.", "questions": [{"q": "According to the passage, what are two benefits of cooking at home?", "model": "People can save money and eat healthier food.", "keywords": ["save", "money", "healthier", "healthy", "food"]}, {"q": "According to the passage, why do some people cook at home?", "model": "Because they enjoy it as a hobby.", "keywords": ["hobby", "enjoy", "fun"]}, {"q": "Please look at the picture. What is the girl doing?", "model": "She is cutting vegetables in the kitchen.", "keywords": ["cutting", "vegetables", "kitchen", "chopping"]}, {"q": "Do you help with cooking at home?", "model": "Yes, I sometimes help my mother cook dinner. I enjoy making simple dishes. / No, I don't cook very often, but I would like to learn.", "keywords": ["help", "cook", "dinner", "simple", "learn", "mother"]}, {"q": "Do you think it is important for young people to learn how to cook?", "model": "Yes, I think cooking is an important life skill. It helps people save money and stay healthy.", "keywords": ["important", "skill", "healthy", "save", "money", "life"]}]}, {"id": 4, "topic": "Using Smartphones", "passage": "Most teenagers in Japan own a smartphone. They use them to communicate with friends, watch videos, and study. However, spending too much time on smartphones can be bad for health and sleep.", "illustration": "A boy is sitting on a sofa, looking at his smartphone. There is a clock on the wall showing 11 PM. His school bag and books are on the table next to him.", "questions": [{"q": "According to the passage, what do teenagers use smartphones for?", "model": "They use them to communicate with friends, watch videos, and study.", "keywords": ["communicate", "friends", "videos", "study", "watch"]}, {"q": "According to the passage, what can be a problem with using smartphones too much?", "model": "It can be bad for health and sleep.", "keywords": ["health", "sleep", "bad", "problem"]}, {"q": "Please look at the picture. What is the boy doing, and what time is it?", "model": "He is using his smartphone late at night. It is 11 PM.", "keywords": ["smartphone", "night", "eleven", "late", "sofa"]}, {"q": "How many hours a day do you use your smartphone?", "model": "I use my smartphone for about two or three hours a day, mainly for studying and messaging friends.", "keywords": ["hours", "day", "study", "messages", "friends"]}, {"q": "Do you think students should be allowed to bring smartphones to school?", "model": "Yes, because smartphones can be useful for studying and looking up information. / No, because they can be a distraction in class.", "keywords": ["school", "study", "distraction", "class", "useful", "allowed", "information"]}]}, {"id": 5, "topic": "Travelling Abroad", "passage": "Many Japanese students are interested in travelling abroad. Visiting other countries helps people learn about different cultures and languages. Some students join study abroad programmes to improve their English skills.", "illustration": "A young woman is standing in front of a famous foreign landmark. She is holding a map and smiling. There are other tourists around her taking photos.", "questions": [{"q": "According to the passage, what can people learn by visiting other countries?", "model": "They can learn about different cultures and languages.", "keywords": ["cultures", "languages", "different", "learn"]}, {"q": "According to the passage, why do some students join study abroad programmes?", "model": "To improve their English skills.", "keywords": ["English", "improve", "skills", "study abroad"]}, {"q": "Please look at the picture. What is the woman doing?", "model": "She is looking at a map in front of a famous landmark.", "keywords": ["map", "landmark", "standing", "smiling", "tourists"]}, {"q": "Have you ever travelled abroad? If not, where would you like to go?", "model": "Yes, I have been to Australia. It was very exciting. / No, but I would love to visit the UK because I want to improve my English.", "keywords": ["travelled", "abroad", "visit", "English", "exciting", "country"]}, {"q": "Do you think studying abroad is a good experience for young people?", "model": "Yes, I think it is a wonderful experience. Students can improve their language skills and learn about other cultures.", "keywords": ["good", "experience", "language", "cultures", "improve", "wonderful"]}]}, {"id": 6, "topic": "Environmental Problems", "passage": "Environmental problems such as pollution and global warming are serious issues today. People can help the environment by recycling and using less plastic. Small actions by many people can make a big difference.", "illustration": "Two students are picking up rubbish in a park. They are wearing gloves and holding rubbish bags. There are trees and flowers around them. A sign says 'Keep the park clean.'", "questions": [{"q": "According to the passage, what are two environmental problems mentioned?", "model": "Pollution and global warming.", "keywords": ["pollution", "global warming"]}, {"q": "According to the passage, how can people help the environment?", "model": "By recycling and using less plastic.", "keywords": ["recycling", "recycle", "plastic", "less"]}, {"q": "Please look at the picture. What are the students doing?", "model": "They are picking up rubbish in a park.", "keywords": ["picking", "rubbish", "park", "trash", "garbage", "cleaning"]}, {"q": "What do you do to help the environment?", "model": "I try to recycle cans and bottles. I also turn off lights when I leave a room to save electricity.", "keywords": ["recycle", "electricity", "lights", "save", "bottles", "cans"]}, {"q": "Do you think the government should do more to protect the environment?", "model": "Yes, I think the government should make stricter rules about pollution and support clean energy.", "keywords": ["government", "environment", "rules", "pollution", "energy", "protect", "clean"]}]}, {"id": 7, "topic": "Part-time Jobs", "passage": "Many high school students in Japan work part-time. They work at convenience stores, restaurants, or supermarkets. Working part-time helps students earn money and learn responsibility. However, they must balance work and study carefully.", "illustration": "A teenage boy is working at a convenience store. He is standing behind a counter and handing a bag to a customer. He is wearing a uniform and smiling.", "questions": [{"q": "According to the passage, where do some students work part-time?", "model": "At convenience stores, restaurants, or supermarkets.", "keywords": ["convenience", "stores", "restaurants", "supermarkets"]}, {"q": "According to the passage, what must students be careful about when working part-time?", "model": "They must balance work and study carefully.", "keywords": ["balance", "work", "study", "careful"]}, {"q": "Please look at the picture. What is the boy doing?", "model": "He is working at a convenience store and serving a customer.", "keywords": ["working", "convenience", "store", "customer", "counter", "serving"]}, {"q": "Do you have a part-time job, or would you like to have one?", "model": "No, I don't have one yet, but I would like to work at a cafe to earn some money and gain experience. / Yes, I work at a supermarket on weekends.", "keywords": ["job", "work", "earn", "money", "experience", "weekends"]}, {"q": "Do you think part-time work is beneficial for students?", "model": "Yes, I think it teaches students responsibility and helps them understand the value of money.", "keywords": ["responsibility", "money", "value", "beneficial", "teaches", "experience"]}]}, {"id": 8, "topic": "Social Media", "passage": "Social media platforms are very popular among young people. People use them to share photos, news, and opinions. While social media helps people stay connected, it can also spread false information.", "illustration": "A teenage girl is sitting at a desk, using a laptop. She is smiling and looking at a social media page. There are many colourful posts on the screen.", "questions": [{"q": "According to the passage, what do people share on social media?", "model": "They share photos, news, and opinions.", "keywords": ["photos", "news", "opinions", "share"]}, {"q": "According to the passage, what is one problem with social media?", "model": "It can spread false information.", "keywords": ["false", "information", "fake", "spread"]}, {"q": "Please look at the picture. What is the girl doing?", "model": "She is using a laptop to look at social media.", "keywords": ["laptop", "social media", "sitting", "desk", "looking"]}, {"q": "Do you use social media? Which platform do you prefer?", "model": "Yes, I use Instagram to share photos with friends. I also use Twitter to read news and see what is trending.", "keywords": ["Instagram", "Twitter", "photos", "friends", "news", "use"]}, {"q": "Do you think social media has more positive or negative effects on society?", "model": "I think it has both, but overall more positive effects because it helps people connect and share information quickly.", "keywords": ["positive", "negative", "connect", "information", "share", "society"]}]}, {"id": 9, "topic": "Healthy Eating", "passage": "Eating healthy food is important for a good life. Many doctors say people should eat more vegetables and fruits and less junk food. A balanced diet helps the body stay strong and the mind stay focused.", "illustration": "A woman is at a farmers' market. She is choosing fresh vegetables from a stall. The stall has many colourful fruits and vegetables. The seller is handing her some tomatoes.", "questions": [{"q": "According to the passage, what do doctors say people should eat more of?", "model": "More vegetables and fruits.", "keywords": ["vegetables", "fruits", "more"]}, {"q": "According to the passage, what are the benefits of a balanced diet?", "model": "It helps the body stay strong and the mind stay focused.", "keywords": ["strong", "focused", "body", "mind", "balanced"]}, {"q": "Please look at the picture. What is the woman doing?", "model": "She is buying vegetables at a farmers' market.", "keywords": ["vegetables", "market", "buying", "choosing", "fresh"]}, {"q": "Do you think you eat a healthy diet?", "model": "I try to eat healthily, but I sometimes eat too much junk food. I am trying to eat more vegetables and less sugar.", "keywords": ["healthy", "vegetables", "junk", "food", "sugar", "try"]}, {"q": "Should schools teach students more about healthy eating?", "model": "Yes, I think schools should have more nutrition classes so students learn what to eat to stay healthy.", "keywords": ["schools", "teach", "nutrition", "healthy", "learn", "class"]}]}, {"id": 10, "topic": "Music and Hobbies", "passage": "Having hobbies is important for mental health and relaxation. Many young people enjoy listening to music, drawing, or playing sports in their free time. Hobbies also help people make new friends with similar interests.", "illustration": "A boy is playing the guitar in his bedroom. He has sheet music in front of him. There are posters of bands on the wall. His friend is sitting nearby, listening and smiling.", "questions": [{"q": "According to the passage, why are hobbies important?", "model": "They are important for mental health and relaxation.", "keywords": ["mental", "health", "relaxation", "important"]}, {"q": "According to the passage, how can hobbies help people socially?", "model": "They help people make new friends with similar interests.", "keywords": ["friends", "similar", "interests", "new", "make"]}, {"q": "Please look at the picture. What is the boy doing?", "model": "He is playing the guitar in his bedroom.", "keywords": ["playing", "guitar", "bedroom", "sheet music"]}, {"q": "What are your hobbies and why do you enjoy them?", "model": "I enjoy reading and playing badminton. Reading helps me relax, and badminton keeps me fit and is fun to play with friends.", "keywords": ["enjoy", "relax", "fit", "fun", "friends", "hobby", "hobbies"]}, {"q": "Do you think it is important to have hobbies outside of studying?", "model": "Yes, I think hobbies are very important. They help reduce stress and give students something to look forward to.", "keywords": ["stress", "reduce", "important", "balance", "look forward", "studying"]}]}], "pre2": [{"id": 1, "topic": "Technology in the Workplace", "passage": "The internet has changed how many people do their jobs. More companies now allow employees to work from home using computers and video calls. This gives workers more flexibility, but some people find it harder to separate their work life from their personal life when working at home.", "illustration_1": "A woman is sitting at a home desk, attending a video meeting on her laptop. Several colleagues appear on the screen. She has a notebook and coffee next to her.", "illustration_2": "The same woman is cooking dinner in the kitchen, but her laptop is open on the counter and she keeps looking at work emails. She looks stressed and tired.", "questions": [{"q": "According to the passage, what has changed about how people work?", "model": "More companies now allow employees to work from home using computers and video calls.", "keywords": ["computers", "video calls", "remote", "work from home", "companies"]}, {"q": "According to the passage, what is one problem with working from home?", "model": "Some people find it harder to separate their work life from their personal life.", "keywords": ["separate", "work", "personal", "life", "balance", "harder", "difficult"]}, {"q": "Please look at picture 1. What is the woman doing?", "model": "She is working from home and attending a video meeting with her colleagues.", "keywords": ["video", "meeting", "colleagues", "laptop", "home", "working"]}, {"q": "Please look at picture 2. What do you think will happen next?", "model": "She will probably continue to check her emails even while cooking, making it difficult for her to relax and enjoy her personal time.", "keywords": ["emails", "work", "stressed", "relax", "personal time", "continue", "difficult"]}, {"q": "Do you think working from home is better than going to the office? Please give a reason for your opinion.", "model": "I think working from home has advantages because people save commuting time and can work more flexibly. However, it can be difficult to concentrate at home.", "keywords": ["home", "office", "commute", "flexible", "concentrate", "disadvantage"]}]}, {"id": 2, "topic": "Museums and Technology", "passage": "Recently, museums have started to use information technology in new ways. Many museums now offer virtual tours online so that people around the world can visit without travelling. Interactive displays and apps also help make exhibitions more engaging, especially for younger visitors.", "illustration_1": "A family is standing in a museum, using tablets to interact with a digital display. The display shows 3D images of ancient artefacts. The children look excited and engaged.", "illustration_2": "A teenager is at home, using a laptop to take a virtual museum tour. She is wearing headphones and looking closely at the screen. She is taking notes in a notebook.", "questions": [{"q": "According to the passage, how can people visit museums without travelling?", "model": "They can take virtual tours online.", "keywords": ["virtual", "tours", "online", "internet", "without travelling"]}, {"q": "According to the passage, how do apps and interactive displays benefit museums?", "model": "They make exhibitions more engaging, especially for younger visitors.", "keywords": ["engaging", "younger", "visitors", "interactive", "displays"]}, {"q": "Please look at picture 1. What is the family doing?", "model": "The family is using tablets to look at interactive digital displays in a museum.", "keywords": ["tablets", "interactive", "museum", "digital", "displays", "children"]}, {"q": "Please look at picture 2. What do you think the girl will do with her notes?", "model": "She will probably use her notes for studying or a school project about what she saw in the virtual museum.", "keywords": ["notes", "study", "project", "school", "learning", "museum"]}, {"q": "Do you think virtual museum tours can replace visiting a museum in person? Please give a reason.", "model": "No, I don't think they can fully replace real visits because you cannot see the actual size of objects or feel the atmosphere of the museum. But virtual tours are useful for people who cannot travel.", "keywords": ["replace", "real", "atmosphere", "useful", "travel", "size", "experience", "person"]}]}, {"id": 3, "topic": "Subscription Services", "passage": "These days, subscription services for music, movies, and software are becoming more common. Instead of buying products, people pay a monthly fee to use them. This can be more convenient and cost-effective, but it also means that people do not actually own what they pay for.", "illustration_1": "A young man is sitting on a sofa, happily watching a streaming service on a large TV. He has popcorn next to him. On the screen, there is a wide selection of films.", "illustration_2": "The same man is on his phone, looking worried at a notification that says his subscription has been cancelled due to a payment issue. He is holding his credit card.", "questions": [{"q": "According to the passage, how do subscription services work?", "model": "Instead of buying products, people pay a monthly fee to use them.", "keywords": ["monthly", "fee", "pay", "instead", "buying", "products"]}, {"q": "According to the passage, what is one disadvantage of subscription services?", "model": "People do not actually own what they pay for.", "keywords": ["do not own", "pay", "disadvantage"]}, {"q": "Please look at picture 1. What is the man doing?", "model": "He is watching a streaming service on TV at home.", "keywords": ["watching", "streaming", "TV", "sofa", "films", "movies"]}, {"q": "Please look at picture 2. What do you think the man will do next?", "model": "He will probably try to fix the payment problem by updating his credit card information so he can continue using the service.", "keywords": ["payment", "credit card", "fix", "update", "continue", "subscription", "worried"]}, {"q": "Do you think subscription services are a good way to access entertainment? Please give a reason.", "model": "Yes, I think they are convenient because you can access a huge variety of content for a fixed monthly price. However, if you subscribe to too many services, it can become expensive.", "keywords": ["convenient", "variety", "content", "monthly", "expensive", "access", "fixed"]}]}, {"id": 4, "topic": "Pets in Modern Society", "passage": "Recently, more people in Japan are choosing to have pets such as cats and dogs. Pets can provide companionship and reduce stress for their owners. However, owning a pet requires a lot of time, money, and responsibility, and some people are not fully prepared for this.", "illustration_1": "An elderly woman is sitting in a park, playing with her small dog. She is smiling and looks very happy. Other people in the park are also watching and smiling.", "illustration_2": "A young couple is looking stressed in their apartment. Their dog has chewed up a shoe and knocked over some books. The dog is sitting in the middle of the mess.", "questions": [{"q": "According to the passage, what are two benefits of having a pet?", "model": "Pets can provide companionship and reduce stress.", "keywords": ["companionship", "reduce", "stress", "company", "lonely", "benefits"]}, {"q": "According to the passage, what do some people fail to do before getting a pet?", "model": "Some people are not fully prepared for the time, money, and responsibility involved.", "keywords": ["prepared", "responsible", "responsibility", "time", "money", "ready"]}, {"q": "Please look at picture 1. What is the woman doing and how does she feel?", "model": "She is playing with her dog in the park, and she looks very happy.", "keywords": ["playing", "dog", "park", "happy", "smiling", "elderly"]}, {"q": "Please look at picture 2. What do you think the couple will do to solve this problem?", "model": "They will probably train their dog or find ways to keep it occupied so it does not destroy things in the apartment.", "keywords": ["training", "occupy", "toys", "solve", "behave", "problem", "apartment"]}, {"q": "Do you think people should have to take a course before getting a pet? Please give your opinion.", "model": "Yes, I think a short course would help people understand the responsibilities involved and ensure pets are properly cared for.", "keywords": ["course", "responsible", "understand", "care", "prepare", "ensure", "properly"]}]}, {"id": 5, "topic": "Environmental Awareness", "passage": "Today, people in Japan are using fewer plastic shopping bags. In 2020, Japan introduced a law requiring shops to charge for plastic bags. This was designed to reduce plastic waste and encourage people to use reusable bags. Many people have changed their habits as a result.", "illustration_1": "A woman is at a supermarket checkout. She is paying for her groceries and handing over a reusable fabric bag. The cashier is putting items into the bag.", "illustration_2": "A beach clean-up event is taking place. Volunteers are picking up plastic bottles and rubbish from the sand. Children and adults are working together. A banner reads 'Save Our Ocean.'", "questions": [{"q": "According to the passage, what law did Japan introduce in 2020?", "model": "A law requiring shops to charge for plastic bags.", "keywords": ["law", "charge", "plastic bags", "shops", "2020", "fee"]}, {"q": "According to the passage, what was the purpose of the new law?", "model": "To reduce plastic waste and encourage people to use reusable bags.", "keywords": ["reduce", "plastic", "waste", "reusable", "encourage", "bags"]}, {"q": "Please look at picture 1. What is the woman doing?", "model": "She is using a reusable bag at the supermarket instead of a plastic bag.", "keywords": ["reusable", "bag", "supermarket", "checkout", "groceries", "paying"]}, {"q": "Please look at picture 2. What do you think will happen if more people join events like this?", "model": "The beaches and oceans will become cleaner, which will help protect marine animals and the environment.", "keywords": ["ocean", "marine", "animals", "environment", "protect", "beaches", "cleaner"]}, {"q": "Do you think individuals or governments have a greater responsibility to reduce plastic waste? Please give a reason.", "model": "I think both have a responsibility. Governments can make laws and policies, but individuals must also change their daily habits to reduce waste.", "keywords": ["government", "individual", "responsibility", "laws", "habits", "reduce", "policies", "daily"]}]}, {"id": 6, "topic": "Traditional Crafts", "passage": "These days, traditional Japanese crafts such as pottery, textiles, and papermaking are being taught online. This allows artisans to share their skills with people around the world. However, some experts worry that online teaching cannot fully replace learning traditional techniques in person.", "illustration_1": "An elderly craftsman is demonstrating pottery techniques in a small workshop. A young woman is watching closely and trying to copy the technique with her own clay.", "illustration_2": "A person is watching an online pottery tutorial on a laptop at home. They are following along using their own clay and tools. There is a mess on the table.", "questions": [{"q": "According to the passage, how are traditional crafts being shared today?", "model": "They are being taught online, allowing artisans to share their skills with people around the world.", "keywords": ["online", "internet", "world", "artisans", "share", "taught", "skills"]}, {"q": "According to the passage, what concern do some experts have about online teaching?", "model": "They worry that online teaching cannot fully replace learning traditional techniques in person.", "keywords": ["replace", "in person", "techniques", "traditional", "fully", "worry", "concern"]}, {"q": "Please look at picture 1. What is happening in the workshop?", "model": "An elderly craftsman is teaching a young woman how to make pottery.", "keywords": ["craftsman", "teaching", "pottery", "clay", "workshop", "learning", "young woman"]}, {"q": "Please look at picture 2. What are the challenges the person at home might face?", "model": "They might find it difficult to get proper feedback on their technique without a teacher present in person.", "keywords": ["feedback", "teacher", "difficult", "technique", "in person", "guidance", "alone"]}, {"q": "Do you think learning traditional crafts is important in modern society? Please give a reason.", "model": "Yes, I think it is important to preserve traditional crafts because they are part of Japan's cultural heritage and would be lost if nobody continued them.", "keywords": ["preserve", "cultural", "heritage", "important", "traditional", "lost", "continue", "society"]}]}, {"id": 7, "topic": "Wild Animals and Farming", "passage": "Recently, many farmers in Japan's countryside have been struggling to protect their crops from wild animals such as deer and boar. These animals enter farmland and destroy crops, causing serious financial losses. Some communities have introduced new methods to keep animals away from farmland.", "illustration_1": "A farmer is standing in his field, looking worried at damaged crops. There are tracks in the soil and broken plants. A deer can be seen in the background near the edge of the field.", "illustration_2": "Workers are installing a tall electric fence around a field of vegetables. A farmer is watching and talking with the workers. Other farmers are observing nearby.", "questions": [{"q": "According to the passage, what problem are farmers facing?", "model": "Wild animals such as deer and boar are entering farmland and destroying their crops.", "keywords": ["wild animals", "deer", "boar", "crops", "destroy", "farmland", "damage"]}, {"q": "According to the passage, what effect does this have on farmers?", "model": "It causes serious financial losses.", "keywords": ["financial", "losses", "money", "serious", "economic"]}, {"q": "Please look at picture 1. What has happened to the farmer's crops?", "model": "Wild animals have entered his field and destroyed some of the crops.", "keywords": ["damaged", "destroyed", "crops", "deer", "tracks", "worried", "field"]}, {"q": "Please look at picture 2. What do you think will happen after the fence is installed?", "model": "The fence will prevent wild animals from entering the field, so the farmer will be able to protect his crops and reduce financial losses.", "keywords": ["prevent", "protect", "crops", "reduce", "losses", "fence", "animals", "safe"]}, {"q": "Do you think the government should do more to help farmers deal with this problem? Please give a reason.", "model": "Yes, I think the government should provide financial support for protective measures like fences, as farmers cannot always afford them on their own.", "keywords": ["government", "support", "financial", "farmers", "afford", "help", "measures", "fences"]}]}, {"id": 8, "topic": "Health and Face Masks", "passage": "People in Japan have long used face masks to protect their health, particularly during cold and flu seasons. In recent years, wearing masks has become even more common. While masks can help prevent the spread of illness, some researchers suggest that wearing them too often may affect children's ability to develop social skills.", "illustration_1": "A teacher is standing in front of a class. All the students and the teacher are wearing masks. The teacher is writing on the board and the students are listening.", "illustration_2": "Two young children are playing outside without masks. One child is smiling at the other, who is laughing. They are communicating and making facial expressions freely.", "questions": [{"q": "According to the passage, why have people in Japan long worn face masks?", "model": "To protect their health, particularly during cold and flu seasons.", "keywords": ["health", "cold", "flu", "protect", "seasons", "illness"]}, {"q": "According to the passage, what concern do some researchers have about wearing masks?", "model": "They suggest that wearing masks too often may affect children's ability to develop social skills.", "keywords": ["social skills", "children", "develop", "affect", "concern", "too often"]}, {"q": "Please look at picture 1. What is happening in the classroom?", "model": "The teacher and all the students are wearing face masks in class.", "keywords": ["masks", "classroom", "teacher", "students", "wearing", "lesson"]}, {"q": "Please look at picture 2. What advantage do the children have by not wearing masks?", "model": "They can communicate more naturally using facial expressions, which helps them develop social and emotional skills.", "keywords": ["facial expressions", "communicate", "naturally", "social", "emotional", "skills", "freely"]}, {"q": "Do you think wearing masks in schools should be made optional? Please give your opinion with a reason.", "model": "Yes, I think it should be optional because children need to see facial expressions to develop communication skills, especially at a young age.", "keywords": ["optional", "children", "expressions", "communication", "young", "develop", "skills"]}]}, {"id": 9, "topic": "Climate Change and Energy", "passage": "Climate change has become one of the most serious global issues of the 21st century. Rising temperatures are causing more extreme weather events such as floods and droughts. Many countries are now investing in renewable energy sources such as solar and wind power to reduce their dependence on fossil fuels.", "illustration_1": "Engineers are working at a large solar panel farm in a dry, sunny region. There are rows of solar panels stretching into the distance. A wind turbine can be seen in the background.", "illustration_2": "A neighbourhood is flooded after a severe storm. Residents are evacuating their homes by boat. Emergency vehicles are parked on higher ground. People look worried.", "questions": [{"q": "According to the passage, what effects is climate change having?", "model": "It is causing rising temperatures and more extreme weather events such as floods and droughts.", "keywords": ["temperatures", "floods", "droughts", "extreme", "weather", "rising", "events"]}, {"q": "According to the passage, what are countries doing to address climate change?", "model": "They are investing in renewable energy sources such as solar and wind power.", "keywords": ["renewable", "solar", "wind", "energy", "investing", "fossil fuels"]}, {"q": "Please look at picture 1. What is happening at this location?", "model": "Engineers are working at a solar panel farm to generate clean renewable energy.", "keywords": ["solar", "panels", "energy", "renewable", "wind turbine", "engineers", "clean"]}, {"q": "Please look at picture 2. What might happen to the people in this neighbourhood in the future if climate change continues?", "model": "They may face more frequent and severe flooding, forcing them to evacuate their homes more often and causing greater damage to the community.", "keywords": ["flooding", "evacuate", "severe", "frequent", "damage", "future", "worse", "continue"]}, {"q": "Do you think individuals can make a meaningful difference in fighting climate change? Please give a reason.", "model": "Yes, I think individuals can make a difference by reducing their energy use, recycling, and choosing sustainable products. Small changes by many people add up.", "keywords": ["reduce", "energy", "recycle", "sustainable", "difference", "individual", "choices", "meaningful"]}]}, {"id": 10, "topic": "Artificial Intelligence", "passage": "Artificial intelligence, or AI, is rapidly changing many industries. AI can now perform tasks that once required human workers, such as analysing data, writing reports, and even creating artwork. While AI increases efficiency, there are growing concerns about its impact on employment and the role of human creativity.", "illustration_1": "A person is working at a computer in an office. On the screen, an AI tool is automatically generating a detailed report. The person is reviewing the results with a satisfied expression.", "illustration_2": "A group of office workers are having a discussion. One person is pointing at a notice on the board that says 'AI System Replacing 30% of Tasks'. Some workers look concerned.", "questions": [{"q": "According to the passage, what kinds of tasks can AI now perform?", "model": "It can analyse data, write reports, and even create artwork.", "keywords": ["data", "reports", "artwork", "analyse", "write", "create", "tasks"]}, {"q": "According to the passage, what concerns do people have about AI?", "model": "There are concerns about its impact on employment and the role of human creativity.", "keywords": ["employment", "jobs", "creativity", "human", "concerns", "impact", "role"]}, {"q": "Please look at picture 1. How is AI being used in this office?", "model": "An AI tool is automatically generating a report, which the worker is reviewing.", "keywords": ["report", "generating", "AI", "automatically", "reviewing", "office", "tool"]}, {"q": "Please look at picture 2. How might the workers be feeling, and why?", "model": "They might be feeling worried or anxious because they are concerned that AI will replace their jobs.", "keywords": ["worried", "anxious", "concerned", "replace", "jobs", "AI", "nervous"]}, {"q": "Do you think AI will create more problems or more opportunities for people in the future? Please give a reason.", "model": "I think AI will create both. While some jobs may disappear, new roles will emerge that require people to work alongside AI. The key is education and adaptability.", "keywords": ["opportunities", "problems", "jobs", "education", "adaptability", "new", "roles", "future"]}]}]};


// ── Speech API wrappers ───────────────────────────────────────
const synth = window.speechSynthesis;
let recognition = null;
let isSpeaking = false;
let isListening = false;

function getVoice(lang) {
  const voices = synth.getVoices();
  return voices.find(v => v.lang.startsWith(lang)) || voices[0] || null;
}

function speakText(text, onEnd) {
  if (isSpeaking) { synth.cancel(); }
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-GB';
  utt.rate = 0.88;
  utt.pitch = 1.0;
  const voice = getVoice('en');
  if (voice) utt.voice = voice;
  utt.onstart  = () => { isSpeaking = true; };
  utt.onend    = () => { isSpeaking = false; if (onEnd) onEnd(); };
  utt.onerror  = () => { isSpeaking = false; if (onEnd) onEnd(); };
  synth.speak(utt);
}

function stopSpeaking() {
  synth.cancel();
  isSpeaking = false;
}

function startListening(onResult, onError) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { onError('not_supported'); return; }
  if (recognition) { try { recognition.abort(); } catch(e){} }
  recognition = new SR();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  isListening = true;
  recognition.onresult = e => {
    isListening = false;
    const transcript = e.results[0][0].transcript;
    onResult(transcript.trim());
  };
  recognition.onerror = e => {
    isListening = false;
    onError(e.error);
  };
  recognition.onend = () => { isListening = false; };
  recognition.start();
}

function stopListening() {
  if (recognition) { try { recognition.stop(); } catch(e){} }
  isListening = false;
}

// ── Keyword scoring ───────────────────────────────────────────
function scoreAnswer(transcript, keywords) {
  if (!transcript) return { score: 0, matched: [], missed: keywords };
  const t = transcript.toLowerCase();
  const matched = [], missed = [];
  keywords.forEach(kw => {
    // check if any word in the keyword phrase appears in transcript
    const kwLower = kw.toLowerCase();
    if (t.includes(kwLower)) matched.push(kw);
    else missed.push(kw);
  });
  const score = Math.round((matched.length / keywords.length) * 100);
  return { score, matched, missed };
}

function gradeScore(score) {
  if (score >= 75) return { label: '優秀 ★★★', color: '#2E7D32', bg: '#E8F5E9' };
  if (score >= 50) return { label: '合格 ★★', color: '#E65100', bg: '#FFF3E0' };
  return { label: '要練習 ★', color: '#C62828', bg: '#FFEBEE' };
}

// ── Interview state ───────────────────────────────────────────
let ivLevel = null;       // '3' or 'P'
let ivSession = null;     // session object
let ivQIdx = 0;           // current question index
let ivResults = [];       // [{transcript, score, matched, missed}]
let ivPhase = 'passage';  // 'passage' | 'question'
let ivPassageRead = false;

const $iv = id => document.getElementById(id);

// ── Entry point: open interview from main menu ────────────────
function openInterviewMenu() {
  hideAll();
  show('iv-level-screen');
}

function startInterviewLevel(lv) {
  ivLevel = lv;
  ivResults = [];
  buildSessionMenu(lv);
  hide('iv-level-screen');
  show('iv-session-screen');
}

function buildSessionMenu(lv) {
  const sessions = INTERVIEW_DATA[lv === '3' ? 'grade3' : 'pre2'];
  const grid = $iv('iv-session-grid');
  grid.innerHTML = '';
  const c = LEVEL_CFG[lv];
  sessions.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'iv-session-btn';
    btn.style.borderLeft = '4px solid ' + c.accent;
    btn.innerHTML = '<span class="iv-session-num" style="background:' + c.accent + '">' + (i+1) + '</span>'
      + '<div><div class="iv-session-title">' + escHtml(s.topic) + '</div>'
      + '<div class="iv-session-desc">' + s.questions.length + '問</div></div>';
    btn.onclick = () => startSession(s);
    grid.appendChild(btn);
  });
}

function startSession(session) {
  ivSession = session;
  ivQIdx = 0;
  ivResults = [];
  ivPhase = 'passage';
  ivPassageRead = false;
  hide('iv-session-screen');
  show('iv-quiz-screen');
  stopSpeaking();
  renderPassagePhase();
}

// ── Passage phase ─────────────────────────────────────────────
function renderPassagePhase() {
  ivPhase = 'passage';
  const s = ivSession;
  const c = LEVEL_CFG[ivLevel];

  $iv('iv-topic-label').textContent = s.topic;
  $iv('iv-topic-label').style.color = c.accent;
  $iv('iv-phase-label').textContent = '問題カードを読んでください';
  $iv('iv-progress').textContent = 'パッセージ';

  let passageHTML = '<div class="iv-passage-text">' + escHtml(s.passage) + '</div>';

  // For Pre-2, show both illustrations as text descriptions
  if (ivLevel === 'P') {
    passageHTML += '<div class="iv-illus-block"><div class="iv-illus-label">🖼 イラスト 1</div>'
      + '<div class="iv-illus-text">' + escHtml(s.illustration_1) + '</div></div>'
      + '<div class="iv-illus-block"><div class="iv-illus-label">🖼 イラスト 2</div>'
      + '<div class="iv-illus-text">' + escHtml(s.illustration_2) + '</div></div>';
  } else {
    passageHTML += '<div class="iv-illus-block"><div class="iv-illus-label">🖼 イラスト</div>'
      + '<div class="iv-illus-text">' + escHtml(s.illustration) + '</div></div>';
  }

  $iv('iv-content-area').innerHTML = passageHTML;

  $iv('iv-btn-listen').style.display = '';
  $iv('iv-btn-listen').textContent = '🔊 パッセージを聞く';
  $iv('iv-btn-listen').onclick = () => {
    $iv('iv-btn-listen').textContent = '🔊 読み上げ中...';
    $iv('iv-btn-listen').disabled = true;
    speakText(s.passage, () => {
      $iv('iv-btn-listen').textContent = '🔊 もう一度聞く';
      $iv('iv-btn-listen').disabled = false;
      ivPassageRead = true;
      $iv('iv-btn-next').style.display = '';
      $iv('iv-btn-next').style.background = cfg().accent;
    });
    ivPassageRead = true;
    $iv('iv-btn-next').style.display = '';
      $iv('iv-btn-next').style.background = cfg().accent;
  };

  $iv('iv-btn-record').style.display = 'none';
  $iv('iv-btn-reveal').style.display = 'none';
  $iv('iv-btn-next').style.display = 'none';
  $iv('iv-btn-next').style.background = cfg().accent;
  $iv('iv-btn-next').textContent = '質問へ進む →';
  $iv('iv-btn-next').onclick = () => { ivPhase = 'question'; ivRenderQuestion(); };
  $iv('iv-transcript-area').innerHTML = '';
  $iv('iv-feedback-area').innerHTML = '';
}

// ── Question phase ────────────────────────────────────────────
function ivRenderQuestion() {
  const s = ivSession;
  const q = s.questions[ivQIdx];
  const c = LEVEL_CFG[ivLevel];
  const total = s.questions.length;

  $iv('iv-phase-label').textContent = '質問 ' + (ivQIdx+1) + ' / ' + total;
  $iv('iv-progress').textContent = '質問 ' + (ivQIdx+1) + '/' + total;
  $iv('iv-topic-label').style.color = c.accent;

  // Show question
  $iv('iv-content-area').innerHTML =
    '<div class="iv-question-box" style="border-color:' + c.accent + '">'
    + '<div class="iv-q-label" style="color:' + c.accent + '">Q' + (ivQIdx+1) + '</div>'
    + '<div class="iv-q-text">' + escHtml(q.q) + '</div></div>';

  // Hear question button
  $iv('iv-btn-listen').style.display = '';
  $iv('iv-btn-listen').textContent = '🔊 質問を聞く';
  $iv('iv-btn-listen').disabled = false;
  $iv('iv-btn-listen').onclick = () => {
    $iv('iv-btn-listen').textContent = '🔊 読み上げ中...';
    $iv('iv-btn-listen').disabled = true;
    speakText(q.q, () => {
      $iv('iv-btn-listen').textContent = '🔊 もう一度聞く';
      $iv('iv-btn-listen').disabled = false;
    });
  };

  // Record button
  $iv('iv-btn-record').style.display = '';
  $iv('iv-btn-record').textContent = '🎤 回答を話す';
  $iv('iv-btn-record').disabled = false;
  $iv('iv-btn-record').className = 'iv-btn-record';
  $iv('iv-btn-record').onclick = handleRecord;

  $iv('iv-btn-reveal').style.display = 'none';
  $iv('iv-btn-next').style.display = 'none';
  $iv('iv-btn-next').style.background = cfg().accent;
  $iv('iv-transcript-area').innerHTML = '';
  $iv('iv-feedback-area').innerHTML = '';
}

function handleRecord() {
  const q = ivSession.questions[ivQIdx];
  const c = LEVEL_CFG[ivLevel];

  stopSpeaking();
  $iv('iv-btn-record').textContent = '⏹ 録音中... (クリックで停止)';
  $iv('iv-btn-record').className = 'iv-btn-record recording';
  $iv('iv-transcript-area').innerHTML = '<span style="color:var(--text3)">聞いています...</span>';

  $iv('iv-btn-record').onclick = () => {
    stopListening();
    $iv('iv-btn-record').textContent = '🎤 もう一度話す';
    $iv('iv-btn-record').className = 'iv-btn-record';
    $iv('iv-btn-record').onclick = handleRecord;
    $iv('iv-transcript-area').innerHTML = '<span style="color:var(--text3)">録音を停止しました。</span>';
  };

  startListening(
    transcript => {
      const result = scoreAnswer(transcript, q.keywords);
      const grade = gradeScore(result.score);
      ivResults[ivQIdx] = { transcript, ...result };

      $iv('iv-transcript-area').innerHTML =
        '<div class="iv-transcript-label">あなたの回答：</div>'
        + '<div class="iv-transcript-text">' + escHtml(transcript) + '</div>';

      const matchedHTML = result.matched.length
        ? '<span class="kw-match">✓ ' + result.matched.map(escHtml).join('</span> <span class="kw-match">✓ ') + '</span>'
        : '<span style="color:var(--text3)">（キーワードなし）</span>';
      const missedHTML = result.missed.length
        ? result.missed.map(k => '<span class="kw-miss">' + escHtml(k) + '</span>').join(' ')
        : '<span style="color:#2E7D32">なし</span>';

      $iv('iv-feedback-area').innerHTML =
        '<div class="iv-score-pill" style="background:' + grade.bg + ';color:' + grade.color + '">'
        + grade.label + ' — ' + result.score + '%</div>'
        + '<div class="iv-kw-row"><span class="iv-kw-label">含まれたキーワード：</span>' + matchedHTML + '</div>'
        + '<div class="iv-kw-row"><span class="iv-kw-label">不足キーワード：</span>' + missedHTML + '</div>';

      $iv('iv-btn-record').textContent = '🎤 もう一度話す';
      $iv('iv-btn-record').className = 'iv-btn-record';
      $iv('iv-btn-record').onclick = handleRecord;
      $iv('iv-btn-reveal').style.display = '';
      $iv('iv-btn-next').style.display = '';
      $iv('iv-btn-next').style.background = cfg().accent;
      $iv('iv-btn-next').textContent = ivQIdx+1 >= ivSession.questions.length ? '結果を見る →' : '次の質問 →';
      $iv('iv-btn-next').onclick = () => {
        stopSpeaking();
        if (ivQIdx+1 >= ivSession.questions.length) showInterviewResults();
        else { ivQIdx++; ivRenderQuestion(); }
      };
    },
    err => {
      $iv('iv-btn-record').textContent = '🎤 もう一度話す';
      $iv('iv-btn-record').className = 'iv-btn-record';
      $iv('iv-btn-record').onclick = handleRecord;
      if (err === 'not_supported') {
        $iv('iv-transcript-area').innerHTML =
          '<div style="color:#C62828;font-size:13px">⚠️ このブラウザは音声認識に対応していません。Chrome をご利用ください。</div>';
      } else {
        $iv('iv-transcript-area').innerHTML =
          '<div style="color:#C62828;font-size:13px">⚠️ 音声を認識できませんでした。もう一度お試しください。（エラー：' + err + '）</div>';
      }
      $iv('iv-btn-reveal').style.display = '';
    }
  );
}

// ── Model answer reveal — handled inside initInterviewListeners ──

// ── Results screen ────────────────────────────────────────────
function showInterviewResults() {
  stopSpeaking();
  hide('iv-quiz-screen');
  show('iv-results-screen');
  const c = LEVEL_CFG[ivLevel];
  const answered = ivResults.filter(r => r);
  const avg = answered.length
    ? Math.round(answered.reduce((s,r) => s+r.score, 0) / answered.length)
    : 0;
  const grade = gradeScore(avg);

  $iv('iv-result-circle').style.borderColor = c.accent;
  $iv('iv-result-pct').textContent = avg + '%';
  $iv('iv-result-pct').style.color = c.accent;
  $iv('iv-result-grade').textContent = grade.label;
  $iv('iv-result-grade').style.color = grade.color;
  $iv('iv-result-topic').textContent = ivSession.topic;

  let detailHTML = '';
  ivSession.questions.forEach((q, i) => {
    const r = ivResults[i];
    const g = r ? gradeScore(r.score) : null;
    detailHTML += '<div class="iv-result-row">'
      + '<div class="iv-result-q">Q' + (i+1) + ': ' + escHtml(q.q) + '</div>'
      + (r
        ? '<div class="iv-result-transcript">' + escHtml(r.transcript) + '</div>'
          + '<div class="iv-score-pill" style="background:' + g.bg + ';color:' + g.color + ';display:inline-block;margin:4px 0">' + g.label + ' ' + r.score + '%</div>'
        : '<div style="color:var(--text3);font-size:13px">（回答なし）</div>')
      + '<div class="iv-model-answer" style="margin-top:6px"><div class="iv-model-label">模範解答：</div>'
      + '<div class="iv-model-text">' + escHtml(q.model) + '</div></div>'
      + '</div>';
  });
  $iv('iv-result-detail').innerHTML = detailHTML;
}

// ── Navigation wiring (deferred until DOM confirmed ready) ────
function initInterviewListeners() {
  const wire = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };

  wire('iv-back-to-menu',   () => { stopSpeaking(); stopListening(); hide('iv-level-screen'); goMenu(); });
  wire('iv-back-to-levels', () => { stopSpeaking(); hide('iv-session-screen'); show('iv-level-screen'); });
  wire('iv-quit-session',   async () => {
    stopSpeaking(); stopListening();
    const ok = await openModal('セッションを終了しますか？', '現在の進捗は保存されません。', '終了する');
    if (!ok) return;
    hide('iv-quiz-screen'); show('iv-session-screen'); buildSessionMenu(ivLevel);
  });
  wire('iv-results-retry',  () => { hide('iv-results-screen'); startSession(ivSession); });
  wire('iv-results-menu',   () => { stopSpeaking(); hide('iv-results-screen'); show('iv-session-screen'); buildSessionMenu(ivLevel); });
  wire('iv-btn-reveal', function() {
    const q = ivSession.questions[ivQIdx];
    const existing = document.getElementById('iv-feedback-area').innerHTML;
    document.getElementById('iv-feedback-area').innerHTML = existing
      + '<div class="iv-model-answer"><div class="iv-model-label">模範解答：</div>'
      + '<div class="iv-model-text">' + escHtml(q.model) + '</div></div>';
    this.style.display = 'none';
    speakText(q.model);
    const nextBtn = document.getElementById('iv-btn-next');
    if (nextBtn && nextBtn.style.display === 'none') {
      nextBtn.style.display = '';
      nextBtn.style.background = cfg().accent;
      nextBtn.textContent = ivQIdx+1 >= ivSession.questions.length ? '結果を見る →' : '次の質問 →';
      nextBtn.onclick = () => {
        stopSpeaking();
        if (ivQIdx+1 >= ivSession.questions.length) showInterviewResults();
        else { ivQIdx++; ivRenderQuestion(); }
      };
    }
  });

  // Level selector buttons
  document.querySelectorAll('.iv-level-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      startInterviewLevel(this.getAttribute('data-iv-level'));
    });
  });

  console.log('[Interview] Listeners attached.');
  window._interviewLoaded = true;
}

// Run after DOM is ready (scripts are at end of body so DOM is ready,
// but use DOMContentLoaded as a safety net for cached/reordered loads)
console.log('[EikenApp] interview.js parsed OK — wiring listeners...');
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInterviewListeners);
} else {
  initInterviewListeners();
}
